import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/identity/services";

export const instant = false;

type Props = {
  params: Promise<{ eventId: string }>;
};

export default async function StudentEventBookingPage({ params }: Props) {
  const user = await requireRole(["STUDENT"]);
  const { eventId } = await params;

  if (!/^\d+$/.test(eventId)) notFound();

  const event = await prisma.events.findFirst({
    where: {
      id: BigInt(eventId),
      status: "PUBLISHED",
    },
  });

  if (!event) notFound();

  const seats = await prisma.seats.findMany({
    where: { event_id: event.id },
    orderBy: [{ section: "asc" }, { row_label: "asc" }, { seat_number: "asc" }],
  });

  const bookingClosed = event.booking_closes_at <= new Date();

  const grouped = seats.reduce<Record<string, typeof seats>>((groups, seat) => {
    (groups[seat.row_label] ??= []).push(seat);
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-5xl">
        <Link href={`/events/${eventId}`} className="text-sm font-bold text-violet-600">
          ← Event details
        </Link>

        <header className="mt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-violet-600">SEAT SELECTION</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">{event.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{event.venue}</p>
        </header>

        {bookingClosed ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            Booking has closed for this event.
          </div>
        ) : seats.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Seat information is not available for this event yet.
          </div>
        ) : (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="h-2 rounded-t-full bg-slate-400" />
              <div className="rounded-b-[50%] border-b-2 border-slate-300 bg-slate-100 py-3 text-center text-xs font-bold tracking-[0.35em] text-slate-500">
                STAGE
              </div>
            </div>

            <div className="mt-8 space-y-3 overflow-x-auto">
              {Object.entries(grouped).map(([row, rowSeats]) => (
                <div key={row} className="flex min-w-max items-center justify-center gap-2">
                  <span className="w-7 text-center text-sm font-bold text-slate-400">{row}</span>
                  {rowSeats.map((seat) => {
                    const available = seat.status === "AVAILABLE";
                    return (
                      <span
                        key={seat.id.toString()}
                        title={`${row}-${seat.seat_number}: ${seat.status}`}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                          available
                            ? "border border-violet-200 bg-violet-50 text-violet-700"
                            : seat.status === "BOOKED"
                              ? "bg-slate-800 text-white"
                              : seat.status === "HELD"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {seat.seat_number}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div className="flex gap-4 text-xs font-semibold text-slate-500">
                <span>Available</span><span>Held</span><span>Booked</span>
              </div>
              <p className="text-sm text-slate-500">Signed in as {user.name}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
