
import { Seat } from "../../domain/entities/seat.entity";
import { BookingValidationError } from "../../domain/errors/booking.errors";

export interface GetSeatMapInput {
  screeningId: string;
}

export interface SeatMapRepository {
  findByScreeningId(
    screeningId: string,
  ): Promise<readonly Seat[]>;
}

export interface GetSeatMapDependencies {
  seatRepository: SeatMapRepository;
}

export interface SeatMapRow {
  row: string;
  seats: readonly Seat[];
}

export interface GetSeatMapResult {
  screeningId: string;
  rows: readonly SeatMapRow[];
  totalSeats: number;
  availableSeats: number;
  heldSeats: number;
  bookedSeats: number;
  blockedSeats: number;
}

export class GetSeatMapUseCase {
  constructor(
    private readonly dependencies: GetSeatMapDependencies,
  ) {}

  async execute(
    input: GetSeatMapInput,
  ): Promise<GetSeatMapResult> {
    this.validateInput(input);

    const seats =
      await this.dependencies.seatRepository.findByScreeningId(
        input.screeningId,
      );

    const uniqueSeatIds = new Set<string>();

    for (const seat of seats) {
      if (seat.screeningId !== input.screeningId) {
        throw new BookingValidationError(
          "Repository returned a seat from another screening.",
        );
      }

      if (uniqueSeatIds.has(seat.id)) {
        throw new BookingValidationError(
          `Duplicate seat found: ${seat.id}.`,
        );
      }

      uniqueSeatIds.add(seat.id);
    }

    const groupedRows = new Map<string, Seat[]>();

    for (const seat of seats) {
      const rowSeats = groupedRows.get(seat.row) ?? [];
      rowSeats.push(seat);
      groupedRows.set(seat.row, rowSeats);
    }

    const rows: SeatMapRow[] = Array.from(
      groupedRows.entries(),
    )
      .sort(([rowA], [rowB]) =>
        rowA.localeCompare(rowB, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      )
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) =>
          a.number.localeCompare(b.number, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        ),
      }));

    return {
      screeningId: input.screeningId,
      rows,
      totalSeats: seats.length,
      availableSeats: seats.filter(
        (seat) => seat.status === "AVAILABLE",
      ).length,
      heldSeats: seats.filter(
        (seat) => seat.status === "HELD",
      ).length,
      bookedSeats: seats.filter(
        (seat) => seat.status === "BOOKED",
      ).length,
      blockedSeats: seats.filter(
        (seat) => seat.status === "BLOCKED",
      ).length,
    };
  }

  private validateInput(input: GetSeatMapInput): void {
    if (
      !input ||
      typeof input.screeningId !== "string" ||
      input.screeningId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Valid screening ID is required.",
      );
    }
  }
}
