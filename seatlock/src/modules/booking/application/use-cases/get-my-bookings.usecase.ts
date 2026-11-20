
import { Booking } from "../../domain/entities/booking.entity";
import { BookingStatus } from "../../domain/enums/booking-status.enum";
import { BookingValidationError } from "../../domain/errors/booking.errors";

export interface GetMyBookingsInput {
  userId: string;
  status?: BookingStatus;
  page?: number;
  pageSize?: number;
}

export interface UserBookingRepository {
  findByUserId(
    userId: string,
    options: {
      status?: BookingStatus;
      skip: number;
      take: number;
    },
  ): Promise<readonly Booking[]>;

  countByUserId(
    userId: string,
    status?: BookingStatus,
  ): Promise<number>;
}

export interface GetMyBookingsDependencies {
  bookingRepository: UserBookingRepository;
}

export interface GetMyBookingsResult {
  bookings: readonly Booking[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export class GetMyBookingsUseCase {
  constructor(
    private readonly dependencies: GetMyBookingsDependencies,
  ) {}

  async execute(
    input: GetMyBookingsInput,
  ): Promise<GetMyBookingsResult> {
    this.validateInput(input);

    const {
      bookingRepository,
    } = this.dependencies;

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 10;

    const skip = (page - 1) * pageSize;

    const [bookings, totalItems] = await Promise.all([
      bookingRepository.findByUserId(input.userId, {
        status: input.status,
        skip,
        take: pageSize,
      }),
      bookingRepository.countByUserId(
        input.userId,
        input.status,
      ),
    ]);

    if (bookings.length > pageSize) {
      throw new BookingValidationError(
        "Repository returned more bookings than requested.",
      );
    }

    if (
      bookings.some((booking) => booking.userId !== input.userId)
    ) {
      throw new BookingValidationError(
        "Repository returned a booking belonging to another user.",
      );
    }

    if (
      !Number.isSafeInteger(totalItems) ||
      totalItems < 0
    ) {
      throw new BookingValidationError(
        "Repository returned an invalid booking count.",
      );
    }

    return {
      bookings,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  }

  private validateInput(input: GetMyBookingsInput): void {
    if (
      !input ||
      typeof input.userId !== "string" ||
      input.userId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Valid user ID is required.",
      );
    }

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 10;

    if (!Number.isSafeInteger(page) || page < 1) {
      throw new BookingValidationError(
        "Page must be a positive integer.",
      );
    }

    if (
      !Number.isSafeInteger(pageSize) ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      throw new BookingValidationError(
        "Page size must be between 1 and 100.",
      );
    }

    if (
      input.status !== undefined &&
      !Object.values(BookingStatus).includes(input.status)
    ) {
      throw new BookingValidationError(
        "Invalid booking status filter.",
      );
    }
  }
}
