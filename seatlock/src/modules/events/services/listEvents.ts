import { prisma } from "@/lib/prisma";

type Actor = {
  id: bigint;
  role: string;
};

type ListEventsOptions = {
  page?: number;
  limit?: number;
};

export async function listEvents(
  actor?: Actor | null,
  options: ListEventsOptions = {},
) {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));

  let where =
  actor?.role === "ADMIN"
    ? {}
    : actor?.role === "ORGANIZER"
      ? {
          OR: [
            { status: "PUBLISHED" as const },
            { organizer_id: actor.id },
          ],
        }
      : {
          status: "PUBLISHED" as const,
        };

  if (actor?.role === "ADMIN") {
    where = {};
  } else if (actor?.role === "ORGANIZER") {
    where = {
      OR: [
        { status: "PUBLISHED" as const },
        { organizer_id: actor.id },
      ],
    };
  } else {
    where = {
      status: "PUBLISHED" as const,
    };
  }

  const [events, total] = await prisma.$transaction([
    prisma.events.findMany({
      where,
      orderBy: { starts_at: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.events.count({ where }),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}