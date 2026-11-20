import Link from "next/link";
import { Suspense } from "react";
import { requireRole } from "@/modules/identity/services";
import { listEvents } from "@/modules/events/services";
import { PublishEventButton } from "@/components/events/PublishEventButton";

async function OrganizerEventsContent() {
  const user = await requireRole(["ORGANIZER", "ADMIN"]);

  const result = await listEvents(user, {
    page: 1,
    limit: 50,
  });

  const events = result.events;

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My events</h1>
          <p className="mt-2 text-gray-600">
            Manage your events and publication status.
          </p>
        </div>

        <Link
          href="/organizer/events/create"
          className="rounded-lg bg-black px-5 py-3 text-white"
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="rounded-lg border p-6 text-gray-600">
          No events found. Create your first event.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Start date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.id.toString()} className="border-t">
                  <td className="p-4 font-medium">{event.title}</td>

                  <td className="p-4">{event.venue}</td>

                  <td className="p-4">
                    {event.starts_at.toLocaleString()}
                  </td>

                  <td className="p-4">{event.status}</td>

                  <td className="space-y-2 p-4">
                    <Link
                      href={`/organizer/events/${event.id}/edit`}
                      className="block text-blue-600 underline"
                    >
                      Edit
                    </Link>

                    {event.status === "DRAFT" && (
                      <PublishEventButton
                        eventId={event.id.toString()}
                        version={event.version}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default function OrganizerEventsPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading events...</p>}>
      <OrganizerEventsContent />
    </Suspense>
  );
}