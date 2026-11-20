
import { BookingValidationError } from "../../domain/errors/booking.errors";

import type {
  HoldSeatsInput,
} from "../../application/use-cases/hold-seats.usecase";

type UnknownRecord = Record<string, unknown>;

function requireObject(input: unknown): UnknownRecord {
  if (
    input === null ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new BookingValidationError(
      "Hold request must be a valid object.",
    );
  }

  return input as UnknownRecord;
}

function requireText(
  value: unknown,
  field: string,
): string {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    throw new BookingValidationError(
      `${field} is required.`,
    );
  }

  return value.trim();
}

function validateSeatIds(value: unknown): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new BookingValidationError(
      "At least one seat must be selected.",
    );
  }

  const seatIds = value.map((seatId: unknown) =>
    requireText(seatId, "Seat ID"),
  );

  if (new Set(seatIds).size !== seatIds.length) {
    throw new BookingValidationError(
      "Duplicate seat selection is not allowed.",
    );
  }

  return seatIds;
}

export function validateHoldSeatsInput(
  input: unknown,
): HoldSeatsInput {
  const record = requireObject(input);

  return {
    userId: requireText(record.userId, "User ID"),
    screeningId: requireText(
      record.screeningId,
      "Screening ID",
    ),
    seatIds: validateSeatIds(record.seatIds),
  };
}
