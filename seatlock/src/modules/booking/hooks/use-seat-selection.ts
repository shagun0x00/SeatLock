"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import type { Seat } from "../domain/entities/seat.entity";
import { SeatStatus } from "../domain/enums/seat-status.enum";

export interface UseSeatSelectionOptions {
  seats: readonly Seat[];
  maxSeatsPerBooking: number;
}

export interface UseSeatSelectionResult {
  selectedSeatIds: readonly string[];
  selectedSeats: readonly Seat[];
  selectedCount: number;
  totalAmountMinor: number | null;
  currency: string | null;
  hasMixedCurrencies: boolean;
  canSelectMore: boolean;
  isSelected: (seatId: string) => boolean;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
}

export function useSeatSelection({
  seats,
  maxSeatsPerBooking,
}: UseSeatSelectionOptions): UseSeatSelectionResult {
  if (
    !Number.isSafeInteger(maxSeatsPerBooking) ||
    maxSeatsPerBooking < 1
  ) {
    throw new RangeError(
      "Maximum seats per booking must be a positive integer.",
    );
  }

  const [selectedSeatIds, setSelectedSeatIds] = useState<
    string[]
  >([]);

  const seatsById = useMemo(
    () => new Map(seats.map((seat) => [seat.id, seat])),
    [seats],
  );

  const availableSeatIds = useMemo(
    () =>
      new Set(
        seats
          .filter(
            (seat) => seat.status === SeatStatus.AVAILABLE,
          )
          .map((seat) => seat.id),
      ),
    [seats],
  );

  const selectedSeats = useMemo(
    () =>
      selectedSeatIds
        .map((seatId) => seatsById.get(seatId))
        .filter(
          (seat): seat is Seat =>
            seat !== undefined &&
            seat.status === SeatStatus.AVAILABLE,
        ),
    [selectedSeatIds, seatsById],
  );

  const validSelectedSeatIds = useMemo(
    () => selectedSeats.map((seat) => seat.id),
    [selectedSeats],
  );

  const selectedCount = selectedSeats.length;

  const currencies = useMemo(
    () => new Set(selectedSeats.map((seat) => seat.currency)),
    [selectedSeats],
  );

  const hasMixedCurrencies = currencies.size > 1;

  const currency =
    selectedSeats.length > 0 && !hasMixedCurrencies
      ? selectedSeats[0].currency
      : null;

  const totalAmountMinor = hasMixedCurrencies
    ? null
    : selectedSeats.reduce(
        (total, seat) => total + seat.priceMinor,
        0,
      );

  const canSelectMore =
    selectedCount < maxSeatsPerBooking;

  const isSelected = useCallback(
    (seatId: string): boolean =>
      selectedSeatIds.includes(seatId) &&
      availableSeatIds.has(seatId),
    [selectedSeatIds, availableSeatIds],
  );

  const toggleSeat = useCallback(
    (seatId: string): void => {
      const seat = seatsById.get(seatId);

      // Ignore seats that do not exist or are unavailable.
      if (!seat || seat.status !== SeatStatus.AVAILABLE) {
        return;
      }

      setSelectedSeatIds((current) => {
        if (current.includes(seat.id)) {
          return current.filter(
            (selectedId) => selectedId !== seat.id,
          );
        }

        if (current.length >= maxSeatsPerBooking) {
          return current;
        }

        return [...current, seat.id];
      });
    },
    [seatsById, maxSeatsPerBooking],
  );

  const clearSelection = useCallback((): void => {
    setSelectedSeatIds([]);
  }, []);

  return {
    selectedSeatIds: validSelectedSeatIds,
    selectedSeats,
    selectedCount,
    totalAmountMinor,
    currency,
    hasMixedCurrencies,
    canSelectMore,
    isSelected,
    toggleSeat,
    clearSelection,
  };
}
