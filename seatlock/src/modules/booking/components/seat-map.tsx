
"use client";

import {
  useEffect,
  useMemo,
} from "react";

import { Seat } from "../domain/entities/seat.entity";
import type { SeatCategory } from "../domain/entities/seat.entity";

import { SeatStatus } from "../domain/enums/seat-status.enum";

import { useSeatMap } from "../hooks/use-seat-map";
import type { SeatMapLoader } from "../hooks/use-seat-map";

import { useSeatSelection } from "../hooks/use-seat-selection";

import { SeatItem } from "./seat-item";
import { SeatLegend } from "./seat-legend";

export interface SeatMapProps {
  screeningId: string;
  loadSeatMap: SeatMapLoader;
  maxSeatsPerBooking: number;
  showPrices?: boolean;
  onSelectionChange?: (
    selectedSeatIds: readonly string[],
    totalAmountMinor: number | null,
    currency: string | null,
  ) => void;
}

function formatPrice(
  amountMinor: number,
  currency: string,
): string {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    });

    // Default to 2 when maximumFractionDigits is undefined.
    const fractionDigits =
      formatter.resolvedOptions().maximumFractionDigits ?? 2;

    return formatter.format(
      amountMinor / Math.pow(10, fractionDigits),
    );
  } catch {
    return `${currency} ${amountMinor}`;
  }
}

export function SeatMap({
  screeningId,
  loadSeatMap,
  maxSeatsPerBooking,
  showPrices = false,
  onSelectionChange,
}: SeatMapProps) {
  const {
    seatMap,
    isLoading,
    isReady,
    error,
    reload,
  } = useSeatMap(screeningId, loadSeatMap);

  // Convert API seat DTOs into domain Seat entities.
  const domainSeats = useMemo(() => {
    if (!seatMap) {
      return [];
    }

    return seatMap.rows.flatMap((row) =>
      row.seats.map(
        (seatDto) =>
          new Seat({
            id: seatDto.id,
            screeningId: seatDto.screeningId,
            row: seatDto.row,
            number: seatDto.number,
            category: seatDto.category as SeatCategory,
            priceMinor: seatDto.priceMinor,
            currency: seatDto.currency,
            status: seatDto.status as SeatStatus,
            holdId: seatDto.holdId,
            bookingId: seatDto.bookingId,
          }),
      ),
    );
  }, [seatMap]);

  const seatsById = useMemo(
    () =>
      new Map(
        domainSeats.map((seat) => [seat.id, seat]),
      ),
    [domainSeats],
  );

  const {
    selectedSeatIds,
    selectedCount,
    totalAmountMinor,
    currency,
    hasMixedCurrencies,
    canSelectMore,
    isSelected,
    toggleSeat,
    clearSelection,
  } = useSeatSelection({
    seats: domainSeats,
    maxSeatsPerBooking,
  });

  // Notify the parent when the selection changes.
  useEffect(() => {
    onSelectionChange?.(
      selectedSeatIds,
      totalAmountMinor,
      currency,
    );
  }, [
    selectedSeatIds,
    totalAmountMinor,
    currency,
    onSelectionChange,
  ]);

  return (
    <section
      aria-label="Movie theatre seat selection"
      className="w-full space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      {/* HEADER */}

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Choose Your Seats
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select your preferred seats for this screening.
          </p>
        </div>

        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          {selectedCount} / {maxSeatsPerBooking} selected
        </span>
      </header>

      {/* LOADING */}

      {isLoading && (
        <div
          role="status"
          className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-600"
        >
          Loading theatre seat map...
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 p-4"
        >
          <p className="text-sm font-medium text-rose-700">
            {error}
          </p>

          <button
            type="button"
            onClick={reload}
            disabled={isLoading}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* SEAT MAP */}

      {isReady && seatMap && (
        <div className="space-y-6">
          {seatMap.rows.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
              No seats are available for this screening.
            </div>
          ) : (
            <div className="space-y-5">
              {/* CINEMA SCREEN */}

              <div className="mx-auto max-w-2xl">
                <div className="h-2 rounded-t-full bg-slate-400" />

                <div className="rounded-b-[50%] border-b-2 border-slate-300 bg-slate-100 px-4 py-3 text-center">
                  <span className="text-xs font-bold tracking-[0.35em] text-slate-500">
                    SCREEN THIS WAY
                  </span>
                </div>
              </div>

              {/* THEATRE ROWS */}

              <div className="space-y-4 overflow-x-auto py-2">
                {seatMap.rows.map((row) => (
                  <div
                    key={row.row}
                    className="flex min-w-max items-center justify-center gap-3"
                  >
                    <span className="w-7 text-center text-sm font-bold text-slate-500">
                      {row.row}
                    </span>

                    <div className="flex items-center justify-center gap-2">
                      {row.seats.map((seatDto) => {
                        const seat = seatsById.get(seatDto.id);

                        if (!seat) {
                          return null;
                        }

                        return (
                          <SeatItem
                            key={seat.id}
                            seat={seat}
                            isSelected={isSelected(seat.id)}
                            onToggle={toggleSeat}
                            showPrice={showPrices}
                          />
                        );
                      })}
                    </div>

                    <span className="w-7 text-center text-sm font-bold text-slate-500">
                      {row.row}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEAT LEGEND */}

          <SeatLegend />
        </div>
      )}

      {/* SELECTION SUMMARY */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Your Selection
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {selectedCount === 0
                ? "No seats selected yet."
                : `${selectedCount} seat(s) selected.`}
            </p>

            {hasMixedCurrencies && (
              <p
                role="alert"
                className="mt-2 text-xs text-rose-600"
              >
                Selected seats have different currencies.
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              Total price
            </p>

            <p className="text-lg font-bold text-slate-900">
              {hasMixedCurrencies
                ? "Unavailable"
                : totalAmountMinor !== null && currency
                  ? formatPrice(totalAmountMinor, currency)
                  : "--"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearSelection}
          disabled={selectedCount === 0}
          className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Selection
        </button>

        {!canSelectMore && (
          <p className="mt-3 text-xs text-amber-700">
            Maximum seat selection limit reached.
          </p>
        )}
      </div>
    </section>
  );
}
