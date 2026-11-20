
import { Booking } from "../../domain/entities/booking.entity";
import { BookingStatus } from "../../domain/enums/booking-status.enum";

export interface BookingResponse {
  id: string;
  userId: string;
  screeningId: string;
  holdId: string;
  seatIds: readonly string[];
  totalAmountMinor: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  cancelledAt: string | null;
}

export class BookingSerializer {
  static serialize(booking: Booking): BookingResponse {
    return {
      id: booking.id,
      userId: booking.userId,
      screeningId: booking.screeningId,
      holdId: booking.holdId,
      seatIds: [...booking.seatIds],
      totalAmountMinor: booking.totalAmountMinor,
      currency: booking.currency,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      cancelledAt: booking.cancelledAt?.toISOString() ?? null,
    };
  }

  static serializeMany(
    bookings: readonly Booking[],
  ): BookingResponse[] {
    return bookings.map((booking) =>
      this.serialize(booking),
    );
  }
}
