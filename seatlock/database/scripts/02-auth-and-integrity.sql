
BEGIN;

-- ------------------------------------------------
-- AUTHENTICATION SESSIONS
-- Store only a hash of the session token.
-- ------------------------------------------------

CREATE TABLE sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    token_hash VARCHAR(255) NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user
    ON sessions(user_id);

CREATE INDEX idx_sessions_expiry
    ON sessions(expires_at)
    WHERE revoked_at IS NULL;

-- ------------------------------------------------
-- ACTIVE SEAT CLAIMS
-- One row per seat, regardless of whether it is
-- currently held or booked.
-- ------------------------------------------------

CREATE TABLE seat_claims (
    seat_id BIGINT PRIMARY KEY
        REFERENCES seats(id) ON DELETE CASCADE,

    hold_id BIGINT
        REFERENCES holds(id) ON DELETE CASCADE,

    booking_id BIGINT
        REFERENCES bookings(id) ON DELETE RESTRICT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT seat_claim_exactly_one_owner
        CHECK (
            (hold_id IS NOT NULL) <> (booking_id IS NOT NULL)
        )
);

CREATE INDEX idx_seat_claims_hold
    ON seat_claims(hold_id)
    WHERE hold_id IS NOT NULL;

CREATE INDEX idx_seat_claims_booking
    ON seat_claims(booking_id)
    WHERE booking_id IS NOT NULL;

-- ------------------------------------------------
-- SEAT LABEL INTEGRITY
-- NULL section values can bypass ordinary
-- multi-column uniqueness in PostgreSQL.
-- ------------------------------------------------

UPDATE seats
SET section = 'GENERAL'
WHERE section IS NULL;

ALTER TABLE seats
ALTER COLUMN section SET DEFAULT 'GENERAL';

ALTER TABLE seats
ALTER COLUMN section SET NOT NULL;

COMMIT;

