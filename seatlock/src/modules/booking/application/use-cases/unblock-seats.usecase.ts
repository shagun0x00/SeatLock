
import { Seat } from "../../domain/entities/seat.entity";
import { SeatStatus } from "../../domain/enums/seat-status.enum";
import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../../domain/errors/booking.errors";

import {
  SeatRepository,
  TransactionManager,
} from "./hold-seats.usecase";

export interface UnblockSeatsInput {
  screeningId: string;
  seatIds: readonly string[];
}

export interface UnblockSeatsDependencies {
  seatRepository: SeatRepository;
  transactionManager: TransactionManager;
}

export interface UnblockSeatsResult {
  screeningId: string;
  availableSeats: readonly Seat[];
  unblockedSeatCount: number;
}

export class UnblockSeatsUseCase {
  constructor(
    private readonly dependencies: UnblockSeatsDependencies,
  ) {}

  async execute(
    input: UnblockSeatsInput,
  ): Promise<UnblockSeatsResult> {
    this.validateInput(input);

    const {
      seatRepository,
      transactionManager,
    } = this.dependencies;

    return transactionManager.run(async () => {
      const seats = await seatRepository.findByIds(
        input.screeningId,
        input.seatIds,
      );

      if (seats.length !== input.seatIds.length) {
        throw new BookingValidationError(
          "One or more selected seats could not be found.",
        );
      }

      const seatsById = new Map(
        seats.map((seat) => [seat.id, seat]),
      );

      if (seatsById.size !== input.seatIds.length) {
        throw new BookingValidationError(
          "Repository returned duplicate seats.",
        );
      }

      const selectedSeats = input.seatIds.map((seatId) => {
        const seat = seatsById.get(seatId);

        if (!seat) {
          throw new BookingValidationError(
            `Selected seat ${seatId} could not be found.`,
          );
        }

        if (seat.screeningId !== input.screeningId) {
          throw new BookingValidationError(
            `Seat ${seatId} does not belong to the requested screening.`,
          );
        }

        if (seat.status !== SeatStatus.BLOCKED) {
          throw new InvalidSeatStateError(
            `Seat ${seatId} is not blocked and cannot be unblocked.`,
          );
        }

        return seat;
      });

      const availableSeats = selectedSeats.map((seat) =>
        seat.unblock(),
      );

      await seatRepository.saveMany(availableSeats);

      return {
        screeningId: input.screeningId,
        availableSeats,
        unblockedSeatCount: availableSeats.length,
      };
    });
  }

  private validateInput(input: UnblockSeatsInput): void {
    if (
      !input ||
      typeof input.screeningId !== "string" ||
      input.screeningId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Valid screening ID is required.",
      );
    }

    if (
      !Array.isArray(input.seatIds) ||
      input.seatIds.length === 0
    ) {
      throw new BookingValidationError(
        "At least one seat must be selected for unblocking.",
      );
    }

    for (const seatId of input.seatIds) {
      if (
        typeof seatId !== "string" ||
        seatId.trim().length === 0
      ) {
        throw new BookingValidationError(
          "Every selected seat must have a valid ID.",
        );
      }
    }

    if (
      new Set(input.seatIds).size !== input.seatIds.length
    ) {
      throw new BookingValidationError(
        "Duplicate seat selection is not allowed.",
      );
    }
  }
}
