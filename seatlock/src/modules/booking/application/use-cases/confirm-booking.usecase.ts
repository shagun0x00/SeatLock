import { Booking } from "../../domain/entities/booking.entity";
import { Seat } from "../../domain/entities/seat.entity";

import { HoldStatus } from "../../domain/enums/hold-status.enum";
import { SeatStatus } from "../../domain/enums/seat-status.enum";

import { assertHoldNotExpired } from "../../domain/rules/hold-expiration.rule";

import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../../domain/errors/booking.errors";

import {
  SeatRepository,
  HoldRepository,
  TransactionManager,
} from "./hold-seats.usecase";

export interface ConfirmBookingInput {
  userId: string;
  holdId: string;
}

export interface BookingRepository {
  save(booking: Booking): Promise<void>;
}

export interface ConfirmBookingDependencies {
  seatRepository: SeatRepository;
  holdRepository: HoldRepository;
  bookingRepository: BookingRepository;
  transactionManager: TransactionManager;
  generateId: () => string;
  getCurrentTime?: () => Date;
}

export interface ConfirmBookingResult {
  booking: Booking;
  seats: readonly Seat[];
}

export class ConfirmBookingUseCase {
  constructor(
    private readonly dependencies: ConfirmBookingDependencies,
  ) {}

  async execute(
    input: ConfirmBookingInput,
  ): Promise<ConfirmBookingResult> {
    this.validateInput(input);

    const {
      seatRepository,
      holdRepository,
      bookingRepository,
      transactionManager,
      generateId,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    return transactionManager.run(async () => {
      const hold = await holdRepository.findById(input.holdId);

      if (!hold) {
        throw new BookingValidationError(
          "The requested hold could not be found.",
        );
      }

      if (hold.userId !== input.userId) {
        throw new BookingValidationError(
          "This hold does not belong to the current user.",
        );
      }

      if (hold.status !== HoldStatus.ACTIVE) {
        throw new InvalidSeatStateError(
          "Only active holds can be confirmed.",
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

      assertHoldNotExpired(hold.expiresAt, now);

      const seats = await seatRepository.findByIds(
        hold.screeningId,
        hold.seatIds,
      );

      if (seats.length !== hold.seatIds.length) {
        throw new BookingValidationError(
          "One or more held seats could not be found.",
        );
      }

      const bookingId = generateId();

      if (
        typeof bookingId !== "string" ||
        bookingId.trim().length === 0
      ) {
        throw new BookingValidationError(
          "Could not generate a valid booking ID.",
        );
      }

      let totalAmountMinor = 0;
      let currency: string | null = null;

      for (const seat of seats) {
        if (seat.screeningId !== hold.screeningId) {
          throw new BookingValidationError(
            "A held seat belongs to a different screening.",
          );
        }

        if (
          seat.status !== SeatStatus.HELD ||
          seat.holdId !== hold.id
        ) {
          throw new InvalidSeatStateError(
            "A seat is no longer held by this booking request.",
          );
        }

        if (
          currency !== null &&
          currency !== seat.currency
        ) {
          throw new BookingValidationError(
            "All seats must use the same currency.",
          );
        }

        currency = seat.currency;
        totalAmountMinor += seat.priceMinor;

        if (!Number.isSafeInteger(totalAmountMinor)) {
          throw new BookingValidationError(
            "Booking total exceeds the supported amount.",
          );
        }
      }

      if (currency === null) {
        throw new BookingValidationError(
          "Cannot confirm a booking without seats.",
        );
      }

      const booking = new Booking({
        id: bookingId,
        userId: hold.userId,
        screeningId: hold.screeningId,
        holdId: hold.id,
        seatIds: hold.seatIds,
        totalAmountMinor,
        currency,
        createdAt: now,
      });

      const confirmedHold = hold.confirm(now);

      const bookedSeats = seats.map((seat) =>
        seat.book(hold.id, booking.id),
      );

      await seatRepository.saveMany(bookedSeats);
      await holdRepository.save(confirmedHold);
      await bookingRepository.save(booking);

      return {
        booking,
        seats: bookedSeats,
      };
    });
  }

  private validateInput(input: ConfirmBookingInput): void {
    if (
      !input ||
      typeof input.userId !== "string" ||
      input.userId.trim().length === 0 ||
      typeof input.holdId !== "string" ||
      input.holdId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Valid user ID and hold ID are required.",
      );
    }
  }
}
