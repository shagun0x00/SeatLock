
import { BookingStatus } from "../enums/booking-status.enum";
import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../errors/booking.errors";

export interface BookingProps {
  id: string;
  userId: string;
  screeningId: string;
  holdId: string;
  seatIds: readonly string[];
  totalAmountMinor: number;
  currency: string;
  createdAt: Date;
  status?: BookingStatus;
  cancelledAt?: Date | null;
}

export class Booking {
  readonly id: string;
  readonly userId: string;
  readonly screeningId: string;
  readonly holdId: string;
  readonly seatIds: readonly string[];
  readonly totalAmountMinor: number;
  readonly currency: string;
  readonly status: BookingStatus;

  private readonly createdAtTimestamp: number;
  private readonly cancelledAtTimestamp: number | null;

  constructor(props: BookingProps) {
    this.id = this.requireText(props.id, "Booking ID");
    this.userId = this.requireText(props.userId, "User ID");
    this.screeningId = this.requireText(props.screeningId, "Screening ID");
    this.holdId = this.requireText(props.holdId, "Hold ID");

    if (!Array.isArray(props.seatIds) || props.seatIds.length === 0) {
      throw new BookingValidationError(
        "A booking must contain at least one seat.",
      );
    }

    const seatIds = props.seatIds.map((id) =>
      this.requireText(id, "Seat ID"),
    );

    if (new Set(seatIds).size !== seatIds.length) {
      throw new BookingValidationError(
        "A booking cannot contain duplicate seats.",
      );
    }

    if (
      !Number.isSafeInteger(props.totalAmountMinor) ||
      props.totalAmountMinor < 0
    ) {
      throw new BookingValidationError(
        "Booking amount must be a non-negative safe integer.",
      );
    }

    if (!/^[A-Z]{3}$/.test(props.currency)) {
      throw new BookingValidationError(
        "Currency must be a three-letter uppercase currency code.",
      );
    }

    if (
      !(props.createdAt instanceof Date) ||
      !Number.isFinite(props.createdAt.getTime())
    ) {
      throw new BookingValidationError(
        "Booking creation date must be valid.",
      );
    }

    const status = props.status ?? BookingStatus.CONFIRMED;
    const cancelledAt = props.cancelledAt ?? null;

    if (!Object.values(BookingStatus).includes(status)) {
      throw new InvalidSeatStateError("Unknown booking status.");
    }

    if (cancelledAt !== null) {
      if (
        !(cancelledAt instanceof Date) ||
        !Number.isFinite(cancelledAt.getTime())
      ) {
        throw new BookingValidationError(
          "Cancellation date must be valid.",
        );
      }

      if (cancelledAt.getTime() < props.createdAt.getTime()) {
        throw new BookingValidationError(
          "Cancellation cannot occur before booking creation.",
        );
      }
    }

    if (
      status === BookingStatus.CONFIRMED &&
      cancelledAt !== null
    ) {
      throw new InvalidSeatStateError(
        "A confirmed booking cannot have a cancellation date.",
      );
    }

    if (
      status === BookingStatus.CANCELLED &&
      cancelledAt === null
    ) {
      throw new InvalidSeatStateError(
        "A cancelled booking must have a cancellation date.",
      );
    }

    this.seatIds = Object.freeze(seatIds);
    this.totalAmountMinor = props.totalAmountMinor;
    this.currency = props.currency;
    this.createdAtTimestamp = props.createdAt.getTime();
    this.cancelledAtTimestamp = cancelledAt?.getTime() ?? null;
    this.status = status;

    Object.freeze(this);
  }

  get createdAt(): Date {
    return new Date(this.createdAtTimestamp);
  }

  get cancelledAt(): Date | null {
    return this.cancelledAtTimestamp === null
      ? null
      : new Date(this.cancelledAtTimestamp);
  }

  isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  cancel(now: Date = new Date()): Booking {
    if (
      !(now instanceof Date) ||
      !Number.isFinite(now.getTime())
    ) {
      throw new BookingValidationError(
        "Cancellation date must be valid.",
      );
    }

    if (this.status !== BookingStatus.CONFIRMED) {
      throw new InvalidSeatStateError(
        "Only confirmed bookings can be cancelled.",
      );
    }

    if (now.getTime() < this.createdAtTimestamp) {
      throw new BookingValidationError(
        "Cancellation cannot occur before booking creation.",
      );
    }

    return new Booking({
      id: this.id,
      userId: this.userId,
      screeningId: this.screeningId,
      holdId: this.holdId,
      seatIds: this.seatIds,
      totalAmountMinor: this.totalAmountMinor,
      currency: this.currency,
      createdAt: this.createdAt,
      status: BookingStatus.CANCELLED,
      cancelledAt: now,
    });
  }

  private requireText(value: string, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BookingValidationError(`${field} is required.`);
    }

    return value.trim();
  }
}
