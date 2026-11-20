
"use client";

import { useEffect, useRef } from "react";

import {
  useHoldCountdown,
} from "../hooks/use-hold-countdown";

import type {
  HoldExpirationValue,
} from "../hooks/use-hold-countdown";

export interface HoldCountdownProps {
  expiresAt: HoldExpirationValue;
  onExpired?: () => void;
  title?: string;
  compact?: boolean;
}

export function HoldCountdown({
  expiresAt,
  onExpired,
  title = "Your seats are temporarily reserved",
  compact = false,
}: HoldCountdownProps) {
  const {
    remainingSeconds,
    formattedTime,
    isExpired,
    isValid,
    isReady,
  } = useHoldCountdown(expiresAt);

  const notifiedExpiration = useRef<number | null>(null);

  const expiresAtTimestamp =
    expiresAt instanceof Date
      ? expiresAt.getTime()
      : new Date(expiresAt).getTime();

  // Notify the parent only once for each expiration timestamp.
  useEffect(() => {
    if (
      !isReady ||
      !isExpired ||
      !onExpired ||
      notifiedExpiration.current === expiresAtTimestamp
    ) {
      return;
    }

    notifiedExpiration.current = expiresAtTimestamp;
    onExpired();
  }, [
    isReady,
    isExpired,
    onExpired,
    expiresAtTimestamp,
  ]);

  if (!isValid) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-4"
      >
        <p className="text-sm font-semibold text-rose-700">
          Invalid reservation expiration time.
        </p>
      </div>
    );
  }

  const isUrgent =
    !isExpired && remainingSeconds <= 60;

  if (compact) {
    return (
      <div
        role="timer"
        aria-live="off"
        aria-label={
          isExpired
            ? "Seat reservation expired"
            : `${formattedTime} remaining`
        }
        className={[
          "inline-flex items-center gap-2 rounded-lg px-3 py-2",
          isExpired || isUrgent
            ? "bg-rose-50 text-rose-700"
            : "bg-amber-50 text-amber-800",
        ].join(" ")}
      >
        <span aria-hidden="true">
          {isExpired ? "!" : "◷"}
        </span>

        <span className="text-sm font-bold tabular-nums">
          {isReady ? formattedTime : "--:--"}
        </span>
      </div>
    );
  }

  return (
    <section
      aria-label="Seat reservation countdown"
      className={[
        "w-full rounded-2xl border p-5",
        isExpired || isUrgent
          ? "border-rose-200 bg-rose-50"
          : "border-amber-200 bg-amber-50",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <p
          className={[
            "text-sm font-semibold",
            isExpired || isUrgent
              ? "text-rose-700"
              : "text-amber-800",
          ].join(" ")}
        >
          {isExpired ? "Reservation Expired" : title}
        </p>

        <div
          role="timer"
          aria-live="off"
          aria-label={
            isExpired
              ? "Seat reservation expired"
              : `${formattedTime} remaining`
          }
          className={[
            "text-4xl font-extrabold tabular-nums tracking-wider",
            isExpired || isUrgent
              ? "text-rose-700"
              : "text-amber-900",
          ].join(" ")}
        >
          {isReady ? formattedTime : "--:--"}
        </div>

        <p
          className={[
            "text-xs",
            isExpired || isUrgent
              ? "text-rose-600"
              : "text-amber-700",
          ].join(" ")}
        >
          {isExpired
            ? "Your temporary seat reservation has expired."
            : isUrgent
              ? "Your reservation is about to expire."
              : "Complete your booking before the timer reaches zero."}
        </p>
      </div>
    </section>
  );
}
