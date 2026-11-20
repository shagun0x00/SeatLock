
"use client";

import type { Seat } from "../domain/entities/seat.entity";
import { SeatStatus } from "../domain/enums/seat-status.enum";

export interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onToggle: (seatId: string) => void;
  showPrice?: boolean;
  disabled?: boolean;
}

const statusLabels: Record<SeatStatus, string> = {
  [SeatStatus.AVAILABLE]: "Available",
  [SeatStatus.HELD]: "Held",
  [SeatStatus.BOOKED]: "Booked",
  [SeatStatus.BLOCKED]: "Blocked",
};

const statusStyles: Record<SeatStatus, string> = {
  [SeatStatus.AVAILABLE]:
    "border-emerald-500 bg-white text-emerald-700 hover:bg-emerald-50",

  [SeatStatus.HELD]:
    "border-amber-400 bg-amber-100 text-amber-800",

  [SeatStatus.BOOKED]:
    "border-slate-400 bg-slate-200 text-slate-600",

  [SeatStatus.BLOCKED]:
    "border-rose-400 bg-rose-100 text-rose-700",
};

export function SeatItem({
  seat,
  isSelected,
  onToggle,
  showPrice = false,
  disabled = false,
}: SeatItemProps) {
  const isAvailable = seat.status === SeatStatus.AVAILABLE;

  const isDisabled = disabled || !isAvailable;

  const statusLabel = statusLabels[seat.status];

  const seatStyle = isSelected
    ? "border-sky-600 bg-sky-600 text-white shadow-md"
    : statusStyles[seat.status];

  const price = (seat.priceMinor / 100).toFixed(2);

  return (
    <button
      type="button"
      data-seat-id={seat.id}
      aria-label={
        `Row ${seat.row}, seat ${seat.number}, ` +
        `${statusLabel}${isSelected ? ", selected" : ""}`
      }
      aria-pressed={isSelected}
      title={`${seat.row}${seat.number} - ${statusLabel}`}
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          onToggle(seat.id);
        }
      }}
      className={[
        "flex min-h-12 min-w-12 flex-col",
        "items-center justify-center gap-0.5",
        "rounded-lg border-2 px-2 py-1",
        "text-xs font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-sky-500 focus-visible:ring-offset-2",
        seatStyle,
        isDisabled
          ? "cursor-not-allowed opacity-75"
          : "cursor-pointer",
      ].join(" ")}
    >
      <span className="text-sm font-bold">
        {seat.number}
      </span>

      <span className="text-[9px] font-medium">
        {isSelected ? "Selected" : statusLabel}
      </span>

      {showPrice && (
        <span className="text-[9px]">
          {price} {seat.currency}
        </span>
      )}
    </button>
  );
}
