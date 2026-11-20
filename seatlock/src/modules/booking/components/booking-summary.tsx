
"use client";

import type { Seat } from "../domain/entities/seat.entity";

export interface BookingSummaryProps {
  selectedSeats: readonly Seat[];
  onContinue: (seatIds: readonly string[]) => void;
  onRemoveSeat?: (seatId: string) => void;
  isSubmitting?: boolean;
  title?: string;
}

function formatCurrency(
  amountMinor: number,
  currency: string,
): string {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    });

    const fractionDigits =
      formatter.resolvedOptions().maximumFractionDigits ?? 2;

    return formatter.format(
      amountMinor / Math.pow(10, fractionDigits),
    );
  } catch {
    return `${currency} ${amountMinor}`;
  }
}

export function BookingSummary({
  selectedSeats,
  onContinue,
  onRemoveSeat,
  isSubmitting = false,
  title = "Booking Summary",
}: BookingSummaryProps) {
  const currencies = new Set(
    selectedSeats.map((seat) => seat.currency),
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

  const seatIds = selectedSeats.map((seat) => seat.id);

  const canContinue =
    selectedSeats.length > 0 &&
    !hasMixedCurrencies &&
    !isSubmitting;

  const handleContinue = (): void => {
    if (canContinue) {
      onContinue(seatIds);
    }
  };

  return (
    <section
      aria-label="Booking summary"
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {/* HEADER */}

      <header className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Review your selected movie theatre seats.
          </p>
        </div>

        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
          {selectedSeats.length} seats
        </span>
      </header>

      {/* EMPTY STATE */}

      {selectedSeats.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm font-semibold text-slate-600">
            No seats selected
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Select your preferred seats to see your booking summary.
          </p>
        </div>
      ) : (
        <>
          {/* SELECTED SEATS */}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Selected Seats
            </h3>

            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800">
                    Row {seat.row} · Seat {seat.number}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {seat.category}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(
                      seat.priceMinor,
                      seat.currency,
                    )}
                  </span>

                  {onRemoveSeat && (
                    <button
                      type="button"
                      aria-label={`Remove seat ${seat.row}${seat.number}`}
                      onClick={() => onRemoveSeat(seat.id)}
                      disabled={isSubmitting}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CURRENCY VALIDATION */}

          {hasMixedCurrencies && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700"
            >
              Selected seats have different currencies.
              A single total cannot be calculated.
            </p>
          )}

          {/* PRICE SUMMARY */}

          <div className="my-5 border-t border-dashed border-slate-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                Number of seats
              </span>

              <span className="text-sm font-semibold text-slate-800">
                {selectedSeats.length}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                Total Amount
              </span>

              <span className="text-xl font-bold text-slate-900">
                {totalAmountMinor !== null && currency
                  ? formatCurrency(totalAmountMinor, currency)
                  : "Unavailable"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* CONTINUE BUTTON */}

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isSubmitting
          ? "Processing..."
          : "Continue to Reserve Seats"}
      </button>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        Your seats are not reserved until the hold operation succeeds.
      </p>
    </section>
  );
}
