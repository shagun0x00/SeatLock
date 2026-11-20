import { prisma } from "@/lib/prisma";

type Actor = {
  id: bigint;
  role: string;
};

export async function getEvent(
  eventId: bigint,
  actor?: Actor | null,
) {
  const event = await prisma.events.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const isAdmin = actor?.role === "ADMIN";
  const isOwner =
    actor?.role === "ORGANIZER" &&
    actor.id === event.organizer_id;

  if (event.status !== "PUBLISHED" && !isAdmin && !isOwner) {
    throw new Error("FORBIDDEN");
  }

  return event;
}