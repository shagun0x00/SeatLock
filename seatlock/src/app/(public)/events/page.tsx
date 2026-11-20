import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { listEvents } from "@/modules/events/services";

async function EventsContent() {
  await connection();
  const result = await listEvents(undefined, { page: 1, limit: 50 });
  const events = result.events;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/80 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              ◆
            </span>
            <span className="text-xl font-extrabold text-slate-950">
              seat
              <span className="text-violet-600">ora</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm font-semibold text-slate-600 hover:text-violet-600 sm:block"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-violet-200 hover:text-violet-600"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <section className="border-b border-slate-200 bg-white px-6 py-14 lg:py-16">
        <div className="mx-auto max-w-7xl lg:px-4">
          <p className="text-xs font-bold tracking-[0.2em] text-violet-600">
            DISCOVER ON CAMPUS
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Find your next event
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-500">
            Explore upcoming experiences, discover a new community, and reserve
            your place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-7 flex items-end justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-bold text-slate-950">Upcoming events</p>
            <p className="mt-1 text-sm text-slate-500">
              {events.length}{" "}
              {events.length === 1 ? "event" : "events"} available
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600">
              ◇
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No published events yet
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Check back soon — new campus experiences are coming.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const date = event.starts_at;
              return (
                <Link
                  key={String(event.id)}
                  href={`/events/${event.id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <div className="relative h-44 overflow-hidden bg-[#17182f]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(139,92,246,.55),transparent_35%),linear-gradient(135deg,#1e1b4b,#312e81)]" />
                    <div className="absolute left-5 top-5 flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/95 shadow-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
                        {date.toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="mt-0.5 text-2xl font-extrabold text-slate-950">
                        {date.getDate()}
                      </span>
                    </div>
                    <span className="absolute bottom-5 right-5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white backdrop-blur">
                      PUBLISHED
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-extrabold text-slate-950 transition group-hover:text-violet-700">
                      {event.title}
                    </h2>
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <span className="text-violet-500">◆</span>
                      {event.venue}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-sm font-semibold text-slate-600">
                        {date.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-sm font-bold text-violet-600">
                        View event →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading events…
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
