import { prisma } from "@/lib/prisma";
import type { CreateEventInput } from "./createEvent";

type Actor = {
  id: bigint;
  role: string;
};

export type UpdateEventInput = Partial<CreateEventInput>;

export async function updateEvent(
  actor: Actor,
  eventId: bigint,
  expectedVersion: number,
  input: UpdateEventInput,
) {
  if (actor.role !== "ORGANIZER" && actor.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    throw new Error("INVALID_EVENT_VERSION");
  }

  const existing = await prisma.events.findUnique({
    where: { id: eventId },
  });

  if (!existing) {
    throw new Error("EVENT_NOT_FOUND");
  }

  if (actor.role === "ORGANIZER" && existing.organizer_id !== actor.id) {
    throw new Error("FORBIDDEN");
  }

  if (existing.status !== "DRAFT") {
    throw new Error("ONLY_DRAFT_EVENTS_CAN_BE_EDITED");
  }

  if (existing.version !== expectedVersion) {
    throw new Error("EVENT_VERSION_CONFLICT");
  }

  const title = input.title?.trim() ?? existing.title;
  const venue = input.venue?.trim() ?? existing.venue;
  const description =
    input.description === undefined
      ? existing.description
      : input.description?.trim() || null;

  const startsAt = input.starts_at ?? existing.starts_at;
  const endsAt = input.ends_at ?? existing.ends_at;
  const bookingClosesAt =
    input.booking_closes_at ?? existing.booking_closes_at;

  if (!title || title.length > 200 || !venue || venue.length > 255) {
    throw new Error("INVALID_EVENT_DETAILS");
  }

  if (
    startsAt >= endsAt ||
    bookingClosesAt > startsAt
  ) {
    throw new Error("INVALID_EVENT_DATE_RANGE");
  }

  const result = await prisma.events.updateMany({
    where: {
      id: eventId,
      version: expectedVersion,
      ...(actor.role === "ORGANIZER"
        ? { organizer_id: actor.id }
        : {}),
      status: "DRAFT",
    },
    data: {
      title,
      venue,
      description,
      starts_at: startsAt,
      ends_at: endsAt,
      booking_closes_at: bookingClosesAt,
      version: { increment: 1 },
    },
  });

  if (result.count !== 1) {
    throw new Error("EVENT_VERSION_CONFLICT");
  }

  return prisma.events.findUniqueOrThrow({
    where: { id: eventId },
  });
}