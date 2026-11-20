
import { HoldStatus } from "../enums/hold-status.enum";
import { BookingValidationError, InvalidSeatStateError } from "../errors/booking.errors";

export interface HoldProps {
  id: string;
  userId: string;
  screeningId: string;
  seatIds: readonly string[];
  createdAt: Date;
  expiresAt: Date;
  status?: HoldStatus;
}

export class Hold {
  readonly id: string;
  readonly userId: string;
  readonly screeningId: string;
  readonly seatIds: readonly string[];
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly status: HoldStatus;

  constructor(props: HoldProps) {
    this.id = this.requireText(props.id, "Hold ID");
    this.userId = this.requireText(props.userId, "User ID");
    this.screeningId = this.requireText(props.screeningId, "Screening ID");

    if (!Array.isArray(props.seatIds) || props.seatIds.length === 0) {
      throw new BookingValidationError("A hold must contain at least one seat.");
    }

    const seatIds = props.seatIds.map((id) =>
      this.requireText(id, "Seat ID"),
    );

    if (new Set(seatIds).size !== seatIds.length) {
      throw new BookingValidationError("A hold cannot contain duplicate seats.");
    }

    if (
      !(props.createdAt instanceof Date) ||
      !Number.isFinite(props.createdAt.getTime())
    ) {
      throw new BookingValidationError("Hold creation date must be valid.");
    }

    if (
      !(props.expiresAt instanceof Date) ||
      !Number.isFinite(props.expiresAt.getTime())
    ) {
      throw new BookingValidationError("Hold expiration date must be valid.");
    }

    if (props.expiresAt.getTime() <= props.createdAt.getTime()) {
      throw new BookingValidationError(
        "Hold expiration must be later than its creation time.",
      );
    }

    this.seatIds = Object.freeze(seatIds);
    this.createdAt = new Date(props.createdAt.getTime());
    this.expiresAt = new Date(props.expiresAt.getTime());
    this.status = props.status ?? HoldStatus.ACTIVE;

    this.validateStatus();
    Object.freeze(this);
  }

  isExpired(now: Date = new Date()): boolean {
    this.validateDate(now, "Current date");
    return now.getTime() >= this.expiresAt.getTime();
  }

  isActive(now: Date = new Date()): boolean {
    return this.status === HoldStatus.ACTIVE && !this.isExpired(now);
  }

  expire(now: Date = new Date()): Hold {
    this.validateDate(now, "Current date");

    if (this.status !== HoldStatus.ACTIVE) {
      throw new InvalidSeatStateError("Only active holds can expire.");
    }

    if (!this.isExpired(now)) {
      throw new InvalidSeatStateError("A hold cannot expire before its expiration time.");
    }

    return this.copy(HoldStatus.EXPIRED);
  }

  confirm(now: Date = new Date()): Hold {
    this.validateDate(now, "Current date");

    if (!this.isActive(now)) {
      throw new InvalidSeatStateError(
        "Only active, non-expired holds can be confirmed.",
      );
    }

    return this.copy(HoldStatus.CONFIRMED);
  }

  cancel(): Hold {
    if (this.status !== HoldStatus.ACTIVE) {
      throw new InvalidSeatStateError("Only active holds can be cancelled.");
    }

    return this.copy(HoldStatus.CANCELLED);
  }

  private copy(status: HoldStatus): Hold {
    return new Hold({
      id: this.id,
      userId: this.userId,
      screeningId: this.screeningId,
      seatIds: this.seatIds,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      status,
    });
  }

  private validateStatus(): void {
    if (!Object.values(HoldStatus).includes(this.status)) {
      throw new InvalidSeatStateError("Unknown hold status.");
    }
  }

  private validateDate(value: Date, field: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new BookingValidationError(`${field} must be a valid date.`);
    }
  }

  private requireText(value: string, field: string): string {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BookingValidationError(`${field} is required.`);
    }

    return value.trim();
  }
}
