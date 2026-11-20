"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/identity/services";
import { createEvent } from "../services/createEvent";
import { createEventSchema } from "../validators/event.schema";

export type CreateEventState = {
  error?: string;
};

export async function createEventAction(
  _previousState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
    return { error: "You are not authorized to create events." };
  }

  const parsed = createEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    venue: formData.get("venue"),
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"),
    booking_closes_at: formData.get("booking_closes_at"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid event details.",
    };
  }

  const data = parsed.data;

  try {
    await createEvent(
      { id: user.id, role: user.role },
      {
        title: data.title,
        description: data.description,
        venue: data.venue,
        starts_at: new Date(data.starts_at),
        ends_at: new Date(data.ends_at),
        booking_closes_at: new Date(data.booking_closes_at),
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create event.";

    return { error: message };
  }

  redirect("/organizer/events");
}