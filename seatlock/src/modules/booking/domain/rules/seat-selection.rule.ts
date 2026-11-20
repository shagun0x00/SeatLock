
import { Seat } from "../entities/seat.entity";
import { SeatStatus } from "../enums/seat-status.enum";
import {
  BookingValidationError,
  SeatUnavailableError,
} from "../errors/booking.errors";

/**
 * Validates a customer's selected seats.
 */
export function assertValidSeatSelection(
  selectedSeatIds: readonly string[],
  seats: readonly Seat[],
): void {
  if (
    !Array.isArray(selectedSeatIds) ||
    selectedSeatIds.length === 0
  ) {
    throw new BookingValidationError(
      "Please select at least one seat.",
    );
  }

  const uniqueIds = new Set(selectedSeatIds);

  if (uniqueIds.size !== selectedSeatIds.length) {
    throw new BookingValidationError(
      "Duplicate seat selection is not allowed.",
    );
  }

  const seatsById = new Map(
    seats.map((seat) => [seat.id, seat]),
  );

  for (const seatId of selectedSeatIds) {
    if (typeof seatId !== "string" || seatId.trim().length === 0) {
      throw new BookingValidationError(
        "Every selected seat must have a valid ID.",
      );
    }

    const seat = seatsById.get(seatId);

    if (!seat) {
      throw new BookingValidationError(
        `Selected seat ${seatId} does not exist.`,
      );
    }

    if (seat.status !== SeatStatus.AVAILABLE) {
      throw new SeatUnavailableError(seat.id);
    }
  }
}
