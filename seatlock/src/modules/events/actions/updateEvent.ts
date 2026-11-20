
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/identity/services";
import { updateEvent } from "../services/updateEvent";
import { createEventSchema } from "../validators/event.schema";

export type UpdateEventState = {
  error?: string;
};

export async function updateEventAction(
  eventId: string,
  _previousState: UpdateEventState,
  formData: FormData
): Promise<UpdateEventState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
    return { error: "You are not authorized to edit events." };
  }

  if (!/^\d+$/.test(eventId)) {
    return { error: "Invalid event ID." };
  }

  const expectedVersion = Number(formData.get("version"));

  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    return { error: "Invalid event version. Reload the page." };
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
    await updateEvent(user, BigInt(eventId), expectedVersion, {
      title: data.title,
      description: data.description,
      venue: data.venue,
      starts_at: new Date(data.starts_at),
      ends_at: new Date(data.ends_at),
      booking_closes_at: new Date(data.booking_closes_at),
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not update the event.",
    };
  }

  revalidatePath("/organizer/events");
  revalidatePath(`/organizer/events/${eventId}/edit`);
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/");

  redirect("/organizer/events");
}
