import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/modules/events/services";
import { getCurrentUser } from "@/modules/identity/services";

type Props = {
  params: Promise<{ eventId: string }>;
};

export const instant = false;

export default async function EventDetailsPage({ params }: Props) {
  const { eventId } = await params;

  if (!/^\d+$/.test(eventId)) notFound();

  let event;

  const user = await getCurrentUser();

  try {
    // Without an actor, getEvent only exposes published events.
    event = await getEvent(BigInt(eventId));
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl justify-between">
          <Link href="/" className="text-xl font-extrabold">
            seat<span className="text-violet-600">ora</span>
          </Link>
          <Link href="/events" className="font-semibold text-violet-600">
            All Events
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm md:p-12">
          <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
            PUBLISHED
          </span>

          <h1 className="mt-7 text-4xl font-extrabold text-slate-950 md:text-5xl">
            {event.title}
          </h1>

          <p className="mt-5 whitespace-pre-line text-lg leading-8 text-slate-600">
            {event.description || "No description provided for this event."}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              ["Venue", event.venue],
              ["Starts", event.starts_at.toLocaleString("en-IN")],
              ["Ends", event.ends_at.toLocaleString("en-IN")],
              ["Booking closes", event.booking_closes_at.toLocaleString("en-IN")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            {user ? (
              <Link
                href={
                  user.role === "STUDENT"
                    ? `/student/events/${eventId}/book`
                    : user.role === "ORGANIZER"
                    ? `/organizer/events/${eventId}`
                    : "/admin/dashboard"
                }
                className="inline-block rounded-xl bg-violet-600 px-7 py-4 font-bold text-white hover:bg-violet-700"
              >
                {user.role === "STUDENT" ? "Select seats" : "Open dashboard"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-block rounded-xl bg-violet-600 px-7 py-4 font-bold text-white hover:bg-violet-700"
              >
                Log in to continue
              </Link>
            )}
            <p className="mt-3 text-xs text-slate-500">
              Seat selection and booking are handled by the booking module.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
