
import { BookingService } from "../../application/services/booking.service";

export class HoldController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  holdSeats(
    input: Parameters<BookingService["holdSeats"]>[0],
  ) {
    return this.bookingService.holdSeats(input);
  }

  expireHolds() {
    return this.bookingService.expireHolds();
  }
}
