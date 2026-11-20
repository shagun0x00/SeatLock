export class BookingDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BookingValidationError extends BookingDomainError {
  constructor(message: string) {
    super(message, "BOOKING_VALIDATION_ERROR");
  }
}

export class SeatUnavailableError extends BookingDomainError {
  constructor(seatId: string) {
    super(`Seat ${seatId} is not available.`, "SEAT_UNAVAILABLE");
  }
}

export class InvalidSeatStateError extends BookingDomainError {
  constructor(message: string) {
    super(message, "INVALID_SEAT_STATE");
  }
}
