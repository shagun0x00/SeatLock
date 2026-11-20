
"use client";

import type { Booking } from "../domain/entities/booking.entity";
import { BookingStatus } from "../domain/enums/booking-status.enum";

export interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isCancelling?: boolean;
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

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function BookingCard({
  booking,
  onCancel,
  isCancelling = false,
}: BookingCardProps) {
  const isConfirmed =
    booking.status === BookingStatus.CONFIRMED;

  const statusStyle = isConfirmed
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <article
      aria-label={`Booking ${booking.id}`}
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* BOOKING HEADER */}

      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Booking reference
          </p>

          <h2 className="mt-1 break-all text-base font-bold text-slate-900">
            {booking.id}
          </h2>
        </div>

        <span
          className={[
            "rounded-full border px-3 py-1.5",
            "text-xs font-bold",
            statusStyle,
          ].join(" ")}
        >
          {booking.status}
        </span>
      </header>

      {/* BOOKING DETAILS */}

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">
              Screening ID
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-800">
              {booking.screeningId}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Booking date
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(booking.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Number of seats
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {booking.seatIds.length}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Hold reference
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-800">
              {booking.holdId}
            </p>
          </div>
        </div>

        {/* SEAT DETAILS */}

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Booked seats
          </p>

          <div className="flex flex-wrap gap-2">
            {booking.seatIds.map((seatId) => (
              <span
                key={seatId}
                className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700"
              >
                {seatId}
              </span>
            ))}
          </div>
        </div>

        {/* PRICE DETAILS */}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">
              Total booking amount
            </p>

            <p className="mt-1 text-xl font-extrabold text-slate-900">
              {formatCurrency(
                booking.totalAmountMinor,
                booking.currency,
              )}
            </p>
          </div>
        </div>

        {/* CANCELLATION DETAILS */}

        {booking.cancelledAt && (
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-3">
            <p className="text-xs font-semibold text-rose-700">
              Cancellation date
            </p>

            <p className="mt-1 text-sm text-rose-800">
              {formatDate(booking.cancelledAt)}
            </p>
          </div>
        )}

        {/* CANCEL ACTION */}

        {isConfirmed && onCancel && (
          <div className="border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCancelling
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
