
import { BookingStatus } from "../../domain/enums/booking-status.enum";
import { BookingValidationError } from "../../domain/errors/booking.errors";

import type { ConfirmBookingInput } from "../../application/use-cases/confirm-booking.usecase";
import type { CancelBookingInput } from "../../application/use-cases/cancel-booking.usecase";
import type { GetMyBookingsInput } from "../../application/use-cases/get-my-bookings.usecase";

type UnknownRecord = Record<string, unknown>;

function requireObject(input: unknown): UnknownRecord {
  if (
    input === null ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    throw new BookingValidationError(
      "Request must be a valid object.",
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

function requirePositiveInteger(
  value: unknown,
  field: string,
): number {
  if (
    !Number.isSafeInteger(value) ||
    (value as number) < 1
  ) {
    throw new BookingValidationError(
      `${field} must be a positive integer.`,
    );
  }

  return value as number;
}

export function validateConfirmBookingInput(
  input: unknown,
): ConfirmBookingInput {
  const record = requireObject(input);

  return {
    userId: requireText(record.userId, "User ID"),
    holdId: requireText(record.holdId, "Hold ID"),
  };
}

export function validateCancelBookingInput(
  input: unknown,
): CancelBookingInput {
  const record = requireObject(input);

  return {
    userId: requireText(record.userId, "User ID"),
    bookingId: requireText(record.bookingId, "Booking ID"),
  };
}

export function validateGetMyBookingsInput(
  input: unknown,
): GetMyBookingsInput {
  const record = requireObject(input);

  const userId = requireText(record.userId, "User ID");

  const page =
    record.page === undefined
      ? undefined
      : requirePositiveInteger(record.page, "Page");

  const pageSize =
    record.pageSize === undefined
      ? undefined
      : requirePositiveInteger(record.pageSize, "Page size");

  if (pageSize !== undefined && pageSize > 100) {
    throw new BookingValidationError(
      "Page size cannot exceed 100.",
    );
  }

  let status: BookingStatus | undefined;

  if (record.status !== undefined) {
    if (
      typeof record.status !== "string" ||
      !Object.values(BookingStatus).includes(
        record.status as BookingStatus,
      )
    ) {
      throw new BookingValidationError(
        "Invalid booking status.",
      );
    }

    status = record.status as BookingStatus;
  }

  return {
    userId,
    status,
    page,
    pageSize,
  };
}
