"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  SeatMapResponse,
} from "../../../shared/contracts/booking";

export type SeatMapLoader = (
  screeningId: string,
) => Promise<SeatMapResponse>;

export interface UseSeatMapResult {
  seatMap: SeatMapResponse | null;
  rows: SeatMapResponse["rows"];
  totalSeats: number;
  availableSeats: number;
  heldSeats: number;
  bookedSeats: number;
  blockedSeats: number;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  reload: () => void;
}

export function useSeatMap(
  screeningId: string,
  loadSeatMap: SeatMapLoader,
): UseSeatMapResult {
  const [seatMap, setSeatMap] =
    useState<SeatMapResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [reloadVersion, setReloadVersion] = useState(0);

  const reload = useCallback((): void => {
    setReloadVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    const normalizedScreeningId = screeningId.trim();

    if (!normalizedScreeningId) {
      return () => {
        isActive = false;
      };
    }

    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await loadSeatMap(
          normalizedScreeningId,
        );

        if (
          !result ||
          result.screeningId !== normalizedScreeningId
        ) {
          throw new Error(
            "The seat map response does not match the requested screening.",
          );
        }

        if (isActive) {
          setSeatMap(result);
        }
      } catch (caughtError: unknown) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load the seat map.",
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      // Ignore responses from outdated requests.
      isActive = false;
    };
  }, [screeningId, loadSeatMap, reloadVersion]);

  return {
    seatMap,
    rows: seatMap?.rows ?? [],
    totalSeats: seatMap?.totalSeats ?? 0,
    availableSeats: seatMap?.availableSeats ?? 0,
    heldSeats: seatMap?.heldSeats ?? 0,
    bookedSeats: seatMap?.bookedSeats ?? 0,
    blockedSeats: seatMap?.blockedSeats ?? 0,
    isLoading,
    isReady: seatMap !== null && !isLoading,
    error,
    reload,
  };
}
