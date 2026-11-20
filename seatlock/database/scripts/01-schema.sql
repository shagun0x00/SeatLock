
-- =========================================================
-- SEATLOCK DATABASE SCHEMA
-- PostgreSQL
-- =========================================================

BEGIN;

-- ---------------------------------------------------------
-- 1. ENUM TYPES
-- ---------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'ADMIN',
    'ORGANIZER',
    'STUDENT'
);

CREATE TYPE event_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CANCELLED',
    'COMPLETED'
);

CREATE TYPE seat_status AS ENUM (
    'AVAILABLE',
    'HELD',
    'BOOKED',
    'BLOCKED'
);

CREATE TYPE hold_status AS ENUM (
    'ACTIVE',
    'CONFIRMED',
    'EXPIRED',
    'RELEASED'
);

CREATE TYPE booking_status AS ENUM (
    'CONFIRMED',
    'CANCELLED'
);

-- ---------------------------------------------------------
-- 2. USERS
-- Authentication and authorization
-- ---------------------------------------------------------

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    role user_role NOT NULL DEFAULT 'STUDENT',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- ---------------------------------------------------------
-- 3. EVENTS
-- ---------------------------------------------------------

CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    organizer_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE RESTRICT,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    venue VARCHAR(255) NOT NULL,

    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    booking_closes_at TIMESTAMPTZ NOT NULL,

    status event_status NOT NULL DEFAULT 'DRAFT',

    -- Optimistic concurrency control for event updates
    version INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_event_times CHECK (
        ends_at > starts_at
    ),

    CONSTRAINT valid_booking_close CHECK (
        booking_closes_at <= starts_at
    ),

    CONSTRAINT valid_event_version CHECK (
        version > 0
    )
);

CREATE INDEX idx_events_organizer
    ON events(organizer_id);

CREATE INDEX idx_events_status_start
    ON events(status, starts_at);

-- ---------------------------------------------------------
-- 4. SEATS
-- ---------------------------------------------------------

CREATE TABLE seats (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    event_id BIGINT NOT NULL
        REFERENCES events(id) ON DELETE CASCADE,

    section VARCHAR(100),
    row_label VARCHAR(20) NOT NULL,
    seat_number INTEGER NOT NULL,

    status seat_status NOT NULL DEFAULT 'AVAILABLE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_event_seat
        UNIQUE(event_id, section, row_label, seat_number),

    CONSTRAINT valid_seat_number
        CHECK (seat_number > 0)
);

CREATE INDEX idx_seats_event
    ON seats(event_id);

CREATE INDEX idx_seats_event_status
    ON seats(event_id, status);

-- ---------------------------------------------------------
-- 5. HOLDS
-- Temporary reservations
-- ---------------------------------------------------------

CREATE TABLE holds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    student_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE RESTRICT,

    event_id BIGINT NOT NULL
        REFERENCES events(id) ON DELETE CASCADE,

    status hold_status NOT NULL DEFAULT 'ACTIVE',

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A student can have only one active hold per event.
CREATE UNIQUE INDEX idx_one_active_hold_per_student_event
    ON holds(student_id, event_id)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_holds_expiry
    ON holds(expires_at)
    WHERE status = 'ACTIVE';

CREATE INDEX idx_holds_student
    ON holds(student_id);

CREATE INDEX idx_holds_event
    ON holds(event_id);

-- ---------------------------------------------------------
-- 6. HOLD SEATS
-- Junction table: one hold can contain multiple seats.
-- ---------------------------------------------------------

CREATE TABLE hold_seats (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    hold_id BIGINT NOT NULL
        REFERENCES holds(id) ON DELETE CASCADE,

    seat_id BIGINT NOT NULL
        REFERENCES seats(id) ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_seat_per_hold
        UNIQUE(hold_id, seat_id)
);

CREATE INDEX idx_hold_seats_seat
    ON hold_seats(seat_id);

-- ---------------------------------------------------------
-- 7. BOOKINGS
-- Confirmed reservations
-- ---------------------------------------------------------

CREATE TABLE bookings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    student_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE RESTRICT,

    event_id BIGINT NOT NULL
        REFERENCES events(id) ON DELETE RESTRICT,

    hold_id BIGINT UNIQUE
        REFERENCES holds(id) ON DELETE RESTRICT,

    status booking_status NOT NULL DEFAULT 'CONFIRMED',

    confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_student
    ON bookings(student_id);

CREATE INDEX idx_bookings_event
    ON bookings(event_id);

CREATE INDEX idx_bookings_event_status
    ON bookings(event_id, status);

-- ---------------------------------------------------------
-- 8. BOOKING SEATS
-- ---------------------------------------------------------

CREATE TABLE booking_seats (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    booking_id BIGINT NOT NULL
        REFERENCES bookings(id) ON DELETE RESTRICT,

    seat_id BIGINT NOT NULL
        REFERENCES seats(id) ON DELETE RESTRICT,

    checked_in_at TIMESTAMPTZ,
    checked_in_by BIGINT
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_seat_per_booking
        UNIQUE(booking_id, seat_id)
);

CREATE INDEX idx_booking_seats_seat
    ON booking_seats(seat_id);

CREATE INDEX idx_booking_seats_booking
    ON booking_seats(booking_id);

-- ---------------------------------------------------------
-- 9. AUDIT LOG TABLE TEMPLATE
-- Four physical shards.
-- Shard selection is performed by application code:
-- stable_hash(event_id) % 4
-- Non-event actions use actor_id for shard selection.
-- ---------------------------------------------------------

CREATE TABLE audit_logs_0 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs_1 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs_2 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs_3 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id BIGINT,
    actor_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit indexes
CREATE INDEX idx_audit_0_event_created
    ON audit_logs_0(event_id, created_at DESC);

CREATE INDEX idx_audit_1_event_created
    ON audit_logs_1(event_id, created_at DESC);

CREATE INDEX idx_audit_2_event_created
    ON audit_logs_2(event_id, created_at DESC);

CREATE INDEX idx_audit_3_event_created
    ON audit_logs_3(event_id, created_at DESC);

CREATE INDEX idx_audit_0_actor_created
    ON audit_logs_0(actor_id, created_at DESC);

CREATE INDEX idx_audit_1_actor_created
    ON audit_logs_1(actor_id, created_at DESC);

CREATE INDEX idx_audit_2_actor_created
    ON audit_logs_2(actor_id, created_at DESC);

CREATE INDEX idx_audit_3_actor_created
    ON audit_logs_3(actor_id, created_at DESC);

COMMIT;
