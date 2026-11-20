
import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../errors/booking.errors";

/**
 * Calculates the expiration time of a seat hold.
 * Duration is configurable in seconds.
 */
export function calculateHoldExpiration(
  createdAt: Date,
  durationSeconds: number,
): Date {
  if (
    !(createdAt instanceof Date) ||
    !Number.isFinite(createdAt.getTime())
  ) {
    throw new BookingValidationError(
      "Hold creation date must be valid.",
    );
  }

  if (
    !Number.isSafeInteger(durationSeconds) ||
    durationSeconds <= 0
  ) {
    throw new BookingValidationError(
      "Hold duration must be a positive safe integer.",
    );
  }

  const expiresAt = new Date(
    createdAt.getTime() + durationSeconds * 1000,
  );

  if (!Number.isFinite(expiresAt.getTime())) {
    throw new BookingValidationError(
      "Calculated hold expiration date is invalid.",
    );
  }

  return expiresAt;
}

/**
 * Checks whether a hold has reached its expiration time.
 */
export function isHoldExpired(
  expiresAt: Date,
  now: Date = new Date(),
): boolean {
  validateDate(expiresAt, "Hold expiration date");
  validateDate(now, "Current date");

  return now.getTime() >= expiresAt.getTime();
}

/**
 * Rejects operations on expired holds.
 */
export function assertHoldNotExpired(
  expiresAt: Date,
  now: Date = new Date(),
): void {
  if (isHoldExpired(expiresAt, now)) {
    throw new InvalidSeatStateError(
      "This seat hold has expired. Please select the seats again.",
    );
  }
}

function validateDate(value: Date, field: string): void {
  if (
    !(value instanceof Date) ||
    !Number.isFinite(value.getTime())
  ) {
    throw new BookingValidationError(
      `${field} must be a valid date.`,
    );
  }
}
