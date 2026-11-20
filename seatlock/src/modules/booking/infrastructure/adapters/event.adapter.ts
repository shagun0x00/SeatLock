
import { BookingValidationError } from "../../domain/errors/booking.errors";

export const BOOKING_EVENT_TYPES = [
  "SEATS_HELD",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "HOLDS_EXPIRED",
  "SEATS_BLOCKED",
  "SEATS_UNBLOCKED",
] as const;

export type BookingEventType =
  (typeof BOOKING_EVENT_TYPES)[number];

export type BookingAggregateType =
  | "HOLD"
  | "BOOKING"
  | "SCREENING";

export type BookingEventMetadataValue =
  | string
  | number
  | boolean
  | null;

export interface BookingEvent {
  eventId: string;
  eventType: BookingEventType;
  aggregateType: BookingAggregateType;
  aggregateId: string;
  actorId: string | null;
  screeningId: string | null;
  seatIds: readonly string[];
  metadata: Readonly<Record<string, BookingEventMetadataValue>>;
  occurredAt: string;
}

export interface PublishBookingEventInput {
  eventType: BookingEventType;
  aggregateType: BookingAggregateType;
  aggregateId: string;
  actorId?: string | null;
  screeningId?: string | null;
  seatIds?: readonly string[];
  metadata?: Readonly<
    Record<string, BookingEventMetadataValue>
  >;
}

export interface BookingEventPublisher {
  publish(event: BookingEvent): Promise<void>;
}

export interface EventAdapterDependencies {
  publisher: BookingEventPublisher;
  generateId: () => string;
  getCurrentTime?: () => Date;
}

export class EventAdapter {
  constructor(
    private readonly dependencies: EventAdapterDependencies,
  ) {}

  async publish(
    input: PublishBookingEventInput,
  ): Promise<BookingEvent> {
    this.validateInput(input);

    const {
      publisher,
      generateId,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    const eventId = generateId();

    if (
      typeof eventId !== "string" ||
      eventId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Could not generate a valid event ID.",
      );
    }

    const now = getCurrentTime();

    if (
      !(now instanceof Date) ||
      !Number.isFinite(now.getTime())
    ) {
      throw new BookingValidationError(
        "Event timestamp must be a valid date.",
      );
    }

    const metadata = Object.freeze({
      ...(input.metadata ?? {}),
    });

    const event: BookingEvent = Object.freeze({
      eventId: eventId.trim(),
      eventType: input.eventType,
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId.trim(),
      actorId: input.actorId?.trim() ?? null,
      screeningId: input.screeningId?.trim() ?? null,
      seatIds: Object.freeze([
        ...(input.seatIds ?? []),
      ]),
      metadata,
      occurredAt: now.toISOString(),
    });

    await publisher.publish(event);

    return event;
  }

  private validateInput(
    input: PublishBookingEventInput,
  ): void {
    if (!input || typeof input !== "object") {
      throw new BookingValidationError(
        "Booking event input is required.",
      );
    }

    if (
      !BOOKING_EVENT_TYPES.includes(input.eventType)
    ) {
      throw new BookingValidationError(
        "Invalid booking event type.",
      );
    }

    if (
      !["HOLD", "BOOKING", "SCREENING"].includes(
        input.aggregateType,
      )
    ) {
      throw new BookingValidationError(
        "Invalid booking event aggregate type.",
      );
    }

    if (
      typeof input.aggregateId !== "string" ||
      input.aggregateId.trim().length === 0
    ) {
      throw new BookingValidationError(
        "Event aggregate ID is required.",
      );
    }

    if (
      input.actorId !== undefined &&
      input.actorId !== null &&
      (
        typeof input.actorId !== "string" ||
        input.actorId.trim().length === 0
      )
    ) {
      throw new BookingValidationError(
        "Event actor ID must be valid.",
      );
    }

    if (
      input.screeningId !== undefined &&
      input.screeningId !== null &&
      (
        typeof input.screeningId !== "string" ||
        input.screeningId.trim().length === 0
      )
    ) {
      throw new BookingValidationError(
        "Event screening ID must be valid.",
      );
    }

    const seatIds = input.seatIds ?? [];

    if (!Array.isArray(seatIds)) {
      throw new BookingValidationError(
        "Event seat IDs must be an array.",
      );
    }

    for (const seatId of seatIds) {
      if (
        typeof seatId !== "string" ||
        seatId.trim().length === 0
      ) {
        throw new BookingValidationError(
          "Every event seat ID must be valid.",
        );
      }
    }

    if (new Set(seatIds).size !== seatIds.length) {
      throw new BookingValidationError(
        "Duplicate event seat IDs are not allowed.",
      );
    }

    if (
      input.metadata !== undefined &&
      (
        input.metadata === null ||
        typeof input.metadata !== "object" ||
        Array.isArray(input.metadata)
      )
    ) {
      throw new BookingValidationError(
        "Event metadata must be a valid object.",
      );
    }

    for (const value of Object.values(input.metadata ?? {})) {
      if (
        value !== null &&
        !["string", "number", "boolean"].includes(
          typeof value,
        )
      ) {
        throw new BookingValidationError(
          "Event metadata contains an unsupported value.",
        );
      }

      if (
        typeof value === "number" &&
        !Number.isFinite(value)
      ) {
        throw new BookingValidationError(
          "Event metadata numbers must be finite.",
        );
      }
    }
  }
}
