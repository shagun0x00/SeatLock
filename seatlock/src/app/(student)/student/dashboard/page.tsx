import Link from "next/link";
import { connection } from "next/server";
import { requireRole } from "@/modules/identity/services";

export default async function StudentDashboardPage() {
  const user = await requireRole(["STUDENT"]);
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
              STUDENT DASHBOARD
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Here’s what’s happening around campus.
            </p>
          </div>
          <Link
            href="/events"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
          >
            Explore events
          </Link>
        </header>
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/student/bookings"
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              B
            </div>
            <p className="mt-8 text-xs font-bold tracking-wider text-slate-400">
              MY ACTIVITY
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950">
              My bookings
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review your reservations and upcoming experiences.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              View bookings →
            </span>
          </Link>
          <Link
            href="/events"
            className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              E
            </div>
            <p className="mt-8 text-xs font-bold tracking-wider text-slate-400">
              DISCOVER
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950">
              Explore events
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Browse published campus events and find your next seat.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              Browse events →
            </span>
          </Link>
          <div className="rounded-3xl bg-[#17182f] p-7 text-white shadow-xl md:col-span-2 lg:col-span-1">
            <p className="text-xs font-bold tracking-[0.18em] text-violet-300">
              NEXT EXPERIENCE
            </p>
            <h2 className="mt-5 text-2xl font-extrabold">
              There’s always something happening.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Stay connected with your campus community.
            </p>
            <Link
              href="/events"
              className="mt-8 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-violet-50"
            >
              See what’s upcoming
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
