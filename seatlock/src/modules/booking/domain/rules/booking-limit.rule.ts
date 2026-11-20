
import { BookingValidationError } from "../errors/booking.errors";

/**
 * Validates the number of seats allowed in one booking.
 *
 * The maximum is supplied by the caller so the booking policy
 * can be configured for different theatres or screenings.
 */
export function assertBookingSeatLimit(
  seatCount: number,
  maxSeatsPerBooking: number,
): void {
  if (!Number.isSafeInteger(seatCount) || seatCount < 1) {
    throw new BookingValidationError(
      "A booking must contain at least one seat.",
    );
  }

  if (
    !Number.isSafeInteger(maxSeatsPerBooking) ||
    maxSeatsPerBooking < 1
  ) {
    throw new BookingValidationError(
      "Maximum seats per booking must be a positive safe integer.",
    );
  }

  if (seatCount > maxSeatsPerBooking) {
    throw new BookingValidationError(
      `You can book a maximum of ${maxSeatsPerBooking} seats per booking.`,
    );
  }
}
