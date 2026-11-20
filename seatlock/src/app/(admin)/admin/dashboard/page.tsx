import Link from "next/link";
import { Suspense } from "react";
import { requireRole } from "@/modules/identity/services";

async function AdminDashboardContent() {
  const user = await requireRole(["ADMIN"]);
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
            ADMIN CONTROL CENTER
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">
            Platform overview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome, {user.name}. Manage SeatLock from here.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <Link
            href="/admin/users"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">IDENTITY</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              User management
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage accounts, roles, and access.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              Manage users →
            </span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">SECURITY</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              Audit logs
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review platform activity and changes.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              View activity →
            </span>
          </Link>
          <Link
            href="/organizer/events"
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
          >
            <p className="text-xs font-bold text-slate-400">CONTENT</p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-950">
              Event management
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Oversee event listings and publishing.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-violet-600">
              View events →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Loading dashboard…</p>}>
      <AdminDashboardContent />
    </Suspense>
  );
}