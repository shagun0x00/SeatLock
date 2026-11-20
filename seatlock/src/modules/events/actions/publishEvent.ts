"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/modules/identity/services";
import { publishEvent } from "../services/publishEvent";

export type PublishEventState = {
  error?: string;
  success?: string;
};

export async function publishEventAction(
  eventId: string,
  expectedVersion: number
): Promise<PublishEventState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
    return { error: "You are not authorized to publish events." };
  }

  if (!/^\d+$/.test(eventId) || !Number.isInteger(expectedVersion)) {
    return { error: "Invalid event information." };
  }

  try {
    await publishEvent(user, BigInt(eventId), expectedVersion);
    revalidatePath("/organizer/events");
    revalidatePath("/events");

    return { success: "Event published successfully." };
  } catch (error) {
    const code = error instanceof Error ? error.message : "Publishing failed.";
    const messages: Record<string, string> = {
      EVENT_NOT_READY_FOR_PUBLICATION:
        "This event cannot be published yet. Ensure the title and venue are filled, the start and booking deadline are in the future, and booking closes before the event starts.",
      EVENT_NOT_DRAFT: "Only draft events can be published.",
      EVENT_VERSION_CONFLICT:
        "This event changed while you were editing it. Reload the page and try again.",
    };

    return {
      error: messages[code] ?? code,
    };
  }
}