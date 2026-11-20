import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/modules/identity/services";
import { getEvent } from "@/modules/events/services";
import EditEventForm from "@/components/events/EditEventForm";

type Props = {
  params: Promise<{ eventId: string }>;
};

function toDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export default async function EditEventPage({ params }: Props) {
  const { eventId } = await params;

  if (!/^\d+$/.test(eventId)) notFound();

  const user = await requireRole(["ORGANIZER", "ADMIN"]);

  let event;

  try {
    event = await getEvent(BigInt(eventId), user);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/unauthorized");
    }
    notFound();
  }

  if (event.status !== "DRAFT") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">This event cannot be edited</h1>
        <p className="mt-3 text-slate-600">
          Only draft events can currently be edited.
        </p>
        <Link href="/organizer/events" className="mt-6 inline-block text-violet-600">
          Back to events
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <Link href="/organizer/events" className="text-sm font-semibold text-violet-600">
          ← Back to events
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Edit Event</h1>
        <p className="mb-8 mt-2 text-sm text-slate-500">
          Update your draft event details.
        </p>

        <EditEventForm
          eventId={eventId}
          version={event.version}
          title={event.title}
          description={event.description}
          venue={event.venue}
          startsAt={toDateTimeLocal(event.starts_at)}
          endsAt={toDateTimeLocal(event.ends_at)}
          bookingClosesAt={toDateTimeLocal(event.booking_closes_at)}
        />
      </div>
    </main>
  );
}

export const instant = false;
