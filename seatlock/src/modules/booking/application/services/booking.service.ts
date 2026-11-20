
import { HoldSeatsUseCase } from "../use-cases/hold-seats.usecase";
import type { HoldSeatsInput } from "../use-cases/hold-seats.usecase";

import { ConfirmBookingUseCase } from "../use-cases/confirm-booking.usecase";
import type { ConfirmBookingInput } from "../use-cases/confirm-booking.usecase";

import { CancelBookingUseCase } from "../use-cases/cancel-booking.usecase";
import type { CancelBookingInput } from "../use-cases/cancel-booking.usecase";

import { ExpireHoldsUseCase } from "../use-cases/expire-holds.usecase";

import { GetMyBookingsUseCase } from "../use-cases/get-my-bookings.usecase";
import type { GetMyBookingsInput } from "../use-cases/get-my-bookings.usecase";

import { GetSeatMapUseCase } from "../use-cases/get-seat-map.usecase";
import type { GetSeatMapInput } from "../use-cases/get-seat-map.usecase";

import { BlockSeatsUseCase } from "../use-cases/block-seats.usecase";
import type { BlockSeatsInput } from "../use-cases/block-seats.usecase";

import { UnblockSeatsUseCase } from "../use-cases/unblock-seats.usecase";
import type { UnblockSeatsInput } from "../use-cases/unblock-seats.usecase";

export interface BookingServiceDependencies {
  holdSeats: HoldSeatsUseCase;
  confirmBooking: ConfirmBookingUseCase;
  cancelBooking: CancelBookingUseCase;
  expireHolds: ExpireHoldsUseCase;
  getMyBookings: GetMyBookingsUseCase;
  getSeatMap: GetSeatMapUseCase;
  blockSeats: BlockSeatsUseCase;
  unblockSeats: UnblockSeatsUseCase;
}

export class BookingService {
  constructor(
    private readonly useCases: BookingServiceDependencies,
  ) {}

  holdSeats(input: HoldSeatsInput) {
    return this.useCases.holdSeats.execute(input);
  }

  confirmBooking(input: ConfirmBookingInput) {
    return this.useCases.confirmBooking.execute(input);
  }

  cancelBooking(input: CancelBookingInput) {
    return this.useCases.cancelBooking.execute(input);
  }

  expireHolds() {
    return this.useCases.expireHolds.execute();
  }

  getMyBookings(input: GetMyBookingsInput) {
    return this.useCases.getMyBookings.execute(input);
  }

  getSeatMap(input: GetSeatMapInput) {
    return this.useCases.getSeatMap.execute(input);
  }

  blockSeats(input: BlockSeatsInput) {
    return this.useCases.blockSeats.execute(input);
  }

  unblockSeats(input: UnblockSeatsInput) {
    return this.useCases.unblockSeats.execute(input);
  }
}
