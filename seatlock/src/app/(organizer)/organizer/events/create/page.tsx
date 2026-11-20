import Link from "next/link";
import { Suspense } from "react";
import { requireRole } from "@/modules/identity/services";
import { CreateEventForm } from "@/components/events/CreateEventForm";

async function CreateEventContent() {
  await requireRole(["ORGANIZER", "ADMIN"]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/organizer/events"
          className="text-sm font-bold text-violet-600"
        >
          ← Back to events
        </Link>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
            NEW EVENT
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950">
            Create an event
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add the essentials now. You can review it before publishing.
          </p>
          <div className="mt-8">
            <CreateEventForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Loading…</p>}>
      <CreateEventContent />
    </Suspense>
  );
}