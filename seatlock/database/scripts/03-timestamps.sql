
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER seats_updated_at
BEFORE UPDATE ON seats
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER holds_updated_at
BEFORE UPDATE ON holds
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
