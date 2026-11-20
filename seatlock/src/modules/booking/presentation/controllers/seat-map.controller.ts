
import { BookingService } from "../../application/services/booking.service";

export class SeatMapController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  getSeatMap(
    input: Parameters<BookingService["getSeatMap"]>[0],
  ) {
    return this.bookingService.getSeatMap(input);
  }
}
