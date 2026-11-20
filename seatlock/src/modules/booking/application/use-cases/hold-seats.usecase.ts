
import { Seat } from "../../domain/entities/seat.entity";
import { Hold } from "../../domain/entities/hold.entity";

import { assertBookingSeatLimit } from "../../domain/rules/booking-limit.rule";
import { assertValidSeatSelection } from "../../domain/rules/seat-selection.rule";
import { calculateHoldExpiration } from "../../domain/rules/hold-expiration.rule";

import { BookingValidationError } from "../../domain/errors/booking.errors";

export interface HoldSeatsInput {
  userId: string;
  screeningId: string;
  seatIds: readonly string[];
}

export interface SeatRepository {
  findByIds(
    screeningId: string,
    seatIds: readonly string[],
  ): Promise<readonly Seat[]>;

  saveMany(seats: readonly Seat[]): Promise<void>;
}

export interface HoldRepository {
  findById(id: string): Promise<Hold | null>;
  save(hold: Hold): Promise<void>;
}

export interface TransactionManager {
  run<T>(operation: () => Promise<T>): Promise<T>;
}

export interface HoldSeatsConfig {
  maxSeatsPerBooking: number;
  holdDurationSeconds: number;
}

export interface HoldSeatsDependencies {
  seatRepository: SeatRepository;
  holdRepository: HoldRepository;
  transactionManager: TransactionManager;
  config: HoldSeatsConfig;
  generateId: () => string;
  getCurrentTime?: () => Date;
}

export interface HoldSeatsResult {
  hold: Hold;
  seats: readonly Seat[];
}

export class HoldSeatsUseCase {
  constructor(
    private readonly dependencies: HoldSeatsDependencies,
  ) {}

  async execute(input: HoldSeatsInput): Promise<HoldSeatsResult> {
    this.validateInput(input);

    const {
      seatRepository,
      holdRepository,
      transactionManager,
      config,
      generateId,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    assertBookingSeatLimit(
      input.seatIds.length,
      config.maxSeatsPerBooking,
    );

    return transactionManager.run(async () => {
      const now = getCurrentTime();

      if (
        !(now instanceof Date) ||
        !Number.isFinite(now.getTime())
      ) {
        throw new BookingValidationError(
          "Current time must be a valid date.",
        );
      }

      const selectedSeats = await seatRepository.findByIds(
        input.screeningId,
        input.seatIds,
      );

      if (selectedSeats.length !== input.seatIds.length) {
        throw new BookingValidationError(
          "One or more selected seats could not be found.",
        );
      }

      for (const seat of selectedSeats) {
        if (seat.screeningId !== input.screeningId) {
          throw new BookingValidationError(
            "All selected seats must belong to the requested screening.",
          );
        }
      }

      assertValidSeatSelection(input.seatIds, selectedSeats);

      const holdId = generateId();

      if (
        typeof holdId !== "string" ||
        holdId.trim().length === 0
      ) {
        throw new BookingValidationError(
          "Could not generate a valid hold ID.",
        );
      }

      const expiresAt = calculateHoldExpiration(
        now,
        config.holdDurationSeconds,
      );

      const hold = new Hold({
        id: holdId,
        userId: input.userId,
        screeningId: input.screeningId,
        seatIds: input.seatIds,
        createdAt: now,
        expiresAt,
      });

      const updatedSeats = selectedSeats.map((seat) =>
        seat.hold(hold.id),
      );

      await seatRepository.saveMany(updatedSeats);
      await holdRepository.save(hold);

      return {
        hold,
        seats: updatedSeats,
      };
    });
  }

  private validateInput(input: HoldSeatsInput): void {
    if (!input || typeof input !== "object") {
      throw new BookingValidationError(
        "Hold request is required.",
      );
    }

    if (
      typeof input.userId !== "string" ||
      input.userId.trim().length === 0
    ) {
      throw new BookingValidationError("User ID is required.");
    }

    if (
      typeof input.screeningId !== "string" ||
      input.screeningId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Screening ID is required.",
      );
    }

    if (
      !Array.isArray(input.seatIds) ||
      input.seatIds.length === 0
    ) {
      throw new BookingValidationError(
        "At least one seat must be selected.",
      );
    }
  }
}
