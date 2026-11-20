
import { BookingService } from "../../application/services/booking.service";

export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  confirmBooking(
    input: Parameters<BookingService["confirmBooking"]>[0],
  ) {
    return this.bookingService.confirmBooking(input);
  }

  cancelBooking(
    input: Parameters<BookingService["cancelBooking"]>[0],
  ) {
    return this.bookingService.cancelBooking(input);
  }

  getMyBookings(
    input: Parameters<BookingService["getMyBookings"]>[0],
  ) {
    return this.bookingService.getMyBookings(input);
  }
}
