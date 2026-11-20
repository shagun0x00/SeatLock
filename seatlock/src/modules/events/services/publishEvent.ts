import { prisma } from "@/lib/prisma";

type Actor = {
  id: bigint;
  role: string;
};

export async function publishEvent(
  actor: Actor,
  eventId: bigint,
  expectedVersion: number,
) {
  if (actor.role !== "ORGANIZER" && actor.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    throw new Error("INVALID_EVENT_VERSION");
  }

  const event = await prisma.events.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  if (actor.role === "ORGANIZER" && event.organizer_id !== actor.id) {
    throw new Error("FORBIDDEN");
  }

  if (event.status !== "DRAFT") {
    throw new Error("EVENT_NOT_DRAFT");
  }

  if (event.version !== expectedVersion) {
    throw new Error("EVENT_VERSION_CONFLICT");
  }

  const now = new Date();

  if (
    !event.title.trim() ||
    !event.venue.trim() ||
    event.starts_at <= now ||
    event.starts_at >= event.ends_at ||
    event.booking_closes_at > event.starts_at ||
    event.booking_closes_at <= now
  ) {
    throw new Error("EVENT_NOT_READY_FOR_PUBLICATION");
  }

  const result = await prisma.events.updateMany({
    where: {
      id: eventId,
      version: expectedVersion,
      status: "DRAFT",
      ...(actor.role === "ORGANIZER"
        ? { organizer_id: actor.id }
        : {}),
    },
    data: {
      status: "PUBLISHED",
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