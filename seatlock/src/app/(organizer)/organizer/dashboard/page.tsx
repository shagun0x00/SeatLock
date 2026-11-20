import Link from "next/link";
import { requireRole } from "@/modules/identity/services";

export default async function OrganizerDashboardPage() {
  const user = await requireRole(["ORGANIZER", "ADMIN"]);
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
              ORGANIZER WORKSPACE
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Good to see you, {user.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Plan, publish, and manage your campus events.
            </p>
          </div>
          <Link
            href="/organizer/events/create"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
          >
            ＋ Create event
          </Link>
        </header>
        <section className="grid gap-5 md:grid-cols-3">
          <Link
            href="/organizer/events"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">MANAGE</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              My events
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review drafts, publish events, and update details.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              Open event list →
            </span>
          </Link>
          <Link
            href="/organizer/events/create"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">GET STARTED</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              Create event
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Set dates, venues, and booking deadlines.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              Start a draft →
            </span>
          </Link>
          <Link
            href="/events"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">PUBLIC VIEW</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              Explore listings
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              See how published campus events appear publicly.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              View public page →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
