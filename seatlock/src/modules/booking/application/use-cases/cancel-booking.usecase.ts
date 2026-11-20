
import { Booking } from "../../domain/entities/booking.entity";
import { Seat } from "../../domain/entities/seat.entity";

import { BookingStatus } from "../../domain/enums/booking-status.enum";
import { SeatStatus } from "../../domain/enums/seat-status.enum";

import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../../domain/errors/booking.errors";

import {
  SeatRepository,
  TransactionManager,
} from "./hold-seats.usecase";

import { BookingRepository } from "./confirm-booking.usecase";

export interface CancelBookingInput {
  userId: string;
  bookingId: string;
}

export interface CancelBookingRepository
  extends BookingRepository {
  findById(id: string): Promise<Booking | null>;
}

export interface CancelBookingDependencies {
  seatRepository: SeatRepository;
  bookingRepository: CancelBookingRepository;
  transactionManager: TransactionManager;
  getCurrentTime?: () => Date;
}

export interface CancelBookingResult {
  booking: Booking;
  seats: readonly Seat[];
}

export class CancelBookingUseCase {
  constructor(
    private readonly dependencies: CancelBookingDependencies,
  ) {}

  async execute(
    input: CancelBookingInput,
  ): Promise<CancelBookingResult> {
    this.validateInput(input);

    const {
      seatRepository,
      bookingRepository,
      transactionManager,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    return transactionManager.run(async () => {
      const booking = await bookingRepository.findById(
        input.bookingId,
      );

      if (!booking) {
        throw new BookingValidationError(
          "Booking could not be found.",
        );
      }

      if (booking.userId !== input.userId) {
        throw new BookingValidationError(
          "This booking does not belong to the current user.",
        );
      }

      if (booking.status !== BookingStatus.CONFIRMED) {
        throw new InvalidSeatStateError(
          "Only confirmed bookings can be cancelled.",
        );
      }

      const now = getCurrentTime();

      if (
        !(now instanceof Date) ||
        !Number.isFinite(now.getTime())
      ) {
        throw new BookingValidationError(
          "Current time must be valid.",
        );
      }

      const seats = await seatRepository.findByIds(
        booking.screeningId,
        booking.seatIds,
      );

      if (seats.length !== booking.seatIds.length) {
        throw new BookingValidationError(
          "One or more booked seats could not be found.",
        );
      }

      for (const seat of seats) {
        if (
          seat.screeningId !== booking.screeningId ||
          seat.status !== SeatStatus.BOOKED ||
          seat.bookingId !== booking.id
        ) {
          throw new InvalidSeatStateError(
            "A seat is not associated with this booking.",
          );
        }
      }

      const cancelledBooking = booking.cancel(now);

      const releasedSeats = seats.map((seat) =>
        seat.releaseBooking(booking.id),
      );

      await seatRepository.saveMany(releasedSeats);

      await bookingRepository.save(cancelledBooking);

      return {
        booking: cancelledBooking,
        seats: releasedSeats,
      };
    });
  }

  private validateInput(input: CancelBookingInput): void {
    if (
      !input ||
      typeof input.userId !== "string" ||
      input.userId.trim().length === 0 ||
      typeof input.bookingId !== "string" ||
      input.bookingId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Valid user ID and booking ID are required.",
      );
    }
  }
}
