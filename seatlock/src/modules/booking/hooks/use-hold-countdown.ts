"use client";

import { useEffect, useState } from "react";

export type HoldExpirationValue = Date | string | number;

export interface HoldCountdownResult {
  remainingMilliseconds: number;
  remainingSeconds: number;
  minutes: number;
  seconds: number;
  formattedTime: string;
  isExpired: boolean;
  isValid: boolean;
  isReady: boolean;
}

export function useHoldCountdown(
  expiresAt: HoldExpirationValue,
): HoldCountdownResult {
  const expiresAtTimestamp =
    expiresAt instanceof Date
      ? expiresAt.getTime()
      : new Date(expiresAt).getTime();

  const isValid = Number.isFinite(expiresAtTimestamp);

  // null means the countdown has not initialized yet.
  const [remainingMilliseconds, setRemainingMilliseconds] =
    useState<number | null>(() =>
      isValid ? Math.max(0, expiresAtTimestamp - Date.now()) : 0,
    );

  useEffect(() => {
    if (!isValid) {
      return;
    }

    const updateCountdown = (): void => {
      setRemainingMilliseconds((prev) => {
        if (prev === null) {
          return 0;
        }

        const remaining = Math.max(0, expiresAtTimestamp - Date.now());

        if (remaining === 0) {
          return 0;
        }

        return remaining;
      });
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [expiresAtTimestamp, isValid]);

  const isReady = isValid && remainingMilliseconds !== null;

  const actualRemainingMilliseconds =
    remainingMilliseconds ?? 0;

  const remainingSeconds = Math.ceil(
    actualRemainingMilliseconds / 1000,
  );

  const minutes = Math.floor(remainingSeconds / 60);

  const seconds = remainingSeconds % 60;

  const formattedTime = !isReady
    ? "--:--"
    : `${String(minutes).padStart(2, "0")}:${String(
        seconds,
      ).padStart(2, "0")}`;

  const isExpired =
    isReady && actualRemainingMilliseconds === 0;

  return {
    remainingMilliseconds: actualRemainingMilliseconds,
    remainingSeconds,
    minutes,
    seconds,
    formattedTime,
    isExpired,
    isValid,
    isReady,
  };
}

