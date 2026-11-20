import Link from "next/link";
import { connection } from "next/server";
import { listEvents } from "@/modules/events/services";

export default async function FeaturedEvents() {
  await connection();

  const result = await listEvents(undefined, {
    page: 1,
    limit: 3,
  });

  const events = result.events;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-violet-600">
            WHAT&apos;S HAPPENING
          </p>
          <h2 className="mt-3 text-3xl font-extrabold">
            Discover upcoming events
          </h2>
          <p className="mt-3 text-slate-500">
            Find your next campus experience.
          </p>
        </div>
        <Link
          href="/events"
          className="font-bold text-violet-600 hover:text-violet-800"
        >
          View all events →
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
          New events are coming soon. Check back later.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={String(event.id)}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-xs font-bold text-green-700">PUBLISHED</p>
              <h3 className="mt-3 text-xl font-bold">{event.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{event.venue}</p>
              <p className="mt-3 text-sm text-slate-500">
                {event.starts_at.toLocaleString("en-IN")}
              </p>
              <Link
                href={`/events/${event.id}`}
                className="mt-5 inline-block font-semibold text-violet-600"
              >
                View event →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
