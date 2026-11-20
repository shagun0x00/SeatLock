
import { Hold } from "../../domain/entities/hold.entity";
import { Seat } from "../../domain/entities/seat.entity";
import { HoldStatus } from "../../domain/enums/hold-status.enum";
import { SeatStatus } from "../../domain/enums/seat-status.enum";
import {
  BookingValidationError,
  InvalidSeatStateError,
} from "../../domain/errors/booking.errors";

import {
  HoldRepository,
  SeatRepository,
  TransactionManager,
} from "./hold-seats.usecase";

export interface ExpiringHoldRepository extends HoldRepository {
  findExpiredActive(now: Date): Promise<readonly Hold[]>;
}

export interface ExpireHoldsDependencies {
  holdRepository: ExpiringHoldRepository;
  seatRepository: SeatRepository;
  transactionManager: TransactionManager;
  getCurrentTime?: () => Date;
}

export interface ExpireHoldsResult {
  expiredHolds: readonly Hold[];
  releasedSeats: readonly Seat[];
  expiredCount: number;
  releasedSeatCount: number;
}

export class ExpireHoldsUseCase {
  constructor(
    private readonly dependencies: ExpireHoldsDependencies,
  ) {}

  async execute(): Promise<ExpireHoldsResult> {
    const {
      holdRepository,
      seatRepository,
      transactionManager,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    const now = getCurrentTime();

    if (
      !(now instanceof Date) ||
      !Number.isFinite(now.getTime())
    ) {
      throw new BookingValidationError(
        "Current time must be a valid date.",
      );
    }

    const candidates = await holdRepository.findExpiredActive(now);

    const expiredHolds: Hold[] = [];
    const releasedSeats: Seat[] = [];

    for (const candidate of candidates) {
      await transactionManager.run(async () => {
        // Re-read the hold inside the transaction to avoid
        // expiring a hold that was confirmed or cancelled meanwhile.
        const hold = await holdRepository.findById(candidate.id);

        if (!hold || hold.status !== HoldStatus.ACTIVE) {
          return;
        }

        if (hold.expiresAt.getTime() > now.getTime()) {
          return;
        }

        const seats = await seatRepository.findByIds(
          hold.screeningId,
          hold.seatIds,
        );

        if (seats.length !== hold.seatIds.length) {
          throw new BookingValidationError(
            `One or more seats for hold ${hold.id} could not be found.`,
          );
        }

        for (const seat of seats) {
          if (
            seat.screeningId !== hold.screeningId ||
            seat.status !== SeatStatus.HELD ||
            seat.holdId !== hold.id
          ) {
            throw new InvalidSeatStateError(
              `Seat ${seat.id} is not held by hold ${hold.id}.`,
            );
          }
        }

        const expiredHold = hold.expire(now);

        const availableSeats = seats.map((seat) =>
          seat.releaseHold(hold.id),
        );

        await seatRepository.saveMany(availableSeats);
        await holdRepository.save(expiredHold);

        expiredHolds.push(expiredHold);
        releasedSeats.push(...availableSeats);
      });
    }

    return {
      expiredHolds,
      releasedSeats,
      expiredCount: expiredHolds.length,
      releasedSeatCount: releasedSeats.length,
    };
  }
}
