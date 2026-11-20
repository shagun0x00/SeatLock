import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/modules/events/services";

export const instant = false;

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { eventId } = await params;

  if (!/^\d+$/.test(eventId)) {
    notFound();
  }

  const event = await getEvent(BigInt(eventId));

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-extrabold text-slate-950">
            seat<span className="text-violet-600">ora</span>
          </Link>
          <Link
            href="/events"
            className="text-sm font-semibold text-violet-600"
          >
            ← All Events
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-12">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700">
            {event.status}
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            {event.title}
          </h1>

          <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-600">
            {event.description || "No event description available."}
          </p>

          <div className="mt-10 grid gap-5 border-t border-slate-100 pt-8 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">Venue</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {event.venue}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">Starts</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {startDate.toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">Ends</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {endDate.toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">
                Booking closes
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {new Date(event.booking_closes_at).toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-violet-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              Log in to continue
            </Link>

            <Link
              href="/events"
              className="rounded-xl border border-slate-200 px-7 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Browse more events
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
