import { prisma } from "@/lib/prisma";

export type CreateEventInput = {
  title: string;
  description?: string | null;
  venue: string;
  starts_at: Date;
  ends_at: Date;
  booking_closes_at: Date;
};

type Actor = {
  id: bigint;
  role: string;
};

export async function createEvent(
  actor: Actor,
  input: CreateEventInput,
) {
  if (actor.role !== "ORGANIZER" && actor.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (
    !input.title.trim() ||
    !input.venue.trim() ||
    input.title.length > 200 ||
    input.venue.length > 255
  ) {
    throw new Error("INVALID_EVENT_DETAILS");
  }

  if (
    !(input.starts_at instanceof Date) ||
    !(input.ends_at instanceof Date) ||
    !(input.booking_closes_at instanceof Date) ||
    Number.isNaN(input.starts_at.getTime()) ||
    Number.isNaN(input.ends_at.getTime()) ||
    Number.isNaN(input.booking_closes_at.getTime())
  ) {
    throw new Error("INVALID_EVENT_DATES");
  }

  if (
    input.starts_at >= input.ends_at ||
    input.booking_closes_at > input.starts_at
  ) {
    throw new Error("INVALID_EVENT_DATE_RANGE");
  }

  return prisma.events.create({
    data: {
      organizer_id: actor.id,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      venue: input.venue.trim(),
      starts_at: input.starts_at,
      ends_at: input.ends_at,
      booking_closes_at: input.booking_closes_at,
      status: "DRAFT",
    },
  });
}