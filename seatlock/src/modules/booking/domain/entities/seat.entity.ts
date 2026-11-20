
import { SeatStatus } from "../enums/seat-status.enum";

import {
  BookingValidationError,
  InvalidSeatStateError,
  SeatUnavailableError,
} from "../errors/booking.errors";

export type SeatCategory =
  | "STANDARD"
  | "PREMIUM"
  | "RECLINER"
  | "ACCESSIBLE";

export interface SeatProps {
  id: string;
  screeningId: string;
  row: string;
  number: string;
  category: SeatCategory;
  priceMinor: number;
  currency: string;
  status?: SeatStatus;
  holdId?: string | null;
  bookingId?: string | null;
}

export class Seat {
  readonly id: string;
  readonly screeningId: string;
  readonly row: string;
  readonly number: string;
  readonly category: SeatCategory;
  readonly priceMinor: number;
  readonly currency: string;
  readonly status: SeatStatus;
  readonly holdId: string | null;
  readonly bookingId: string | null;

  constructor(props: SeatProps) {
    this.id = this.requireText(props.id, "Seat ID");
    this.screeningId = this.requireText(
      props.screeningId,
      "Screening ID",
    );
    this.row = this.requireText(props.row, "Seat row");
    this.number = this.requireText(props.number, "Seat number");

    if (
      !Number.isSafeInteger(props.priceMinor) ||
      props.priceMinor < 0
    ) {
      throw new BookingValidationError(
        "Seat price must be a non-negative safe integer.",
      );
    }

    if (!/^[A-Z]{3}$/.test(props.currency)) {
      throw new BookingValidationError(
        "Currency must be a three-letter uppercase currency code.",
      );
    }

    const validCategories: SeatCategory[] = [
      "STANDARD",
      "PREMIUM",
      "RECLINER",
      "ACCESSIBLE",
    ];

    if (!validCategories.includes(props.category)) {
      throw new BookingValidationError(
        "Invalid seat category.",
      );
    }

    this.priceMinor = props.priceMinor;
    this.currency = props.currency;
    this.category = props.category;
    this.status = props.status ?? SeatStatus.AVAILABLE;
    this.holdId = props.holdId ?? null;
    this.bookingId = props.bookingId ?? null;

    this.validateState();

    Object.freeze(this);
  }

  hold(holdId: string): Seat {
    const validHoldId = this.requireText(
      holdId,
      "Hold ID",
    );

    if (this.status !== SeatStatus.AVAILABLE) {
      throw new SeatUnavailableError(this.id);
    }

    return this.copy({
      status: SeatStatus.HELD,
      holdId: validHoldId,
      bookingId: null,
    });
  }

  releaseHold(holdId: string): Seat {
    if (
      this.status !== SeatStatus.HELD ||
      this.holdId !== holdId
    ) {
      throw new InvalidSeatStateError(
        "Only the matching active hold can release this seat.",
      );
    }

    return this.copy({
      status: SeatStatus.AVAILABLE,
      holdId: null,
      bookingId: null,
    });
  }

  book(holdId: string, bookingId: string): Seat {
    const validBookingId = this.requireText(
      bookingId,
      "Booking ID",
    );

    if (
      this.status !== SeatStatus.HELD ||
      this.holdId !== holdId
    ) {
      throw new InvalidSeatStateError(
        "The seat must be held by the matching hold before booking.",
      );
    }

    return this.copy({
      status: SeatStatus.BOOKED,
      holdId: null,
      bookingId: validBookingId,
    });
  }

  releaseBooking(bookingId: string): Seat {
    const validBookingId = this.requireText(
      bookingId,
      "Booking ID",
    );

    if (
      this.status !== SeatStatus.BOOKED ||
      this.bookingId !== validBookingId
    ) {
      throw new InvalidSeatStateError(
        "Only the matching booking can release this seat.",
      );
    }

    return this.copy({
      status: SeatStatus.AVAILABLE,
      holdId: null,
      bookingId: null,
    });
  }

  block(): Seat {
    if (this.status !== SeatStatus.AVAILABLE) {
      throw new InvalidSeatStateError(
        "Only available seats can be blocked.",
      );
    }

    return this.copy({
      status: SeatStatus.BLOCKED,
      holdId: null,
      bookingId: null,
    });
  }

  unblock(): Seat {
    if (this.status !== SeatStatus.BLOCKED) {
      throw new InvalidSeatStateError(
        "Only blocked seats can be unblocked.",
      );
    }

    return this.copy({
      status: SeatStatus.AVAILABLE,
      holdId: null,
      bookingId: null,
    });
  }

  private copy(
    changes: Pick<SeatProps, "status" | "holdId" | "bookingId">,
  ): Seat {
    return new Seat({
      id: this.id,
      screeningId: this.screeningId,
      row: this.row,
      number: this.number,
      category: this.category,
      priceMinor: this.priceMinor,
      currency: this.currency,
      ...changes,
    });
  }

  private requireText(
    value: string,
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

  private validateState(): void {
    switch (this.status) {
      case SeatStatus.AVAILABLE:
      case SeatStatus.BLOCKED:
        if (
          this.holdId !== null ||
          this.bookingId !== null
        ) {
          throw new InvalidSeatStateError(
            "Available and blocked seats cannot have hold or booking IDs.",
          );
        }
        break;

      case SeatStatus.HELD:
        if (!this.holdId || this.bookingId !== null) {
          throw new InvalidSeatStateError(
            "A held seat requires a hold ID and cannot have a booking ID.",
          );
        }
        break;

      case SeatStatus.BOOKED:
        if (!this.bookingId || this.holdId !== null) {
          throw new InvalidSeatStateError(
            "A booked seat requires a booking ID and cannot have a hold ID.",
          );
        }
        break;

      default:
        throw new InvalidSeatStateError(
          "Unknown seat status.",
        );
    }
  }
}
