
"use client";

import { useActionState } from "react";
import { updateEventAction, type UpdateEventState } from "@/modules/events/actions/updateEvent";

type Props = {
  eventId: string;
  version: number;
  title: string;
  description: string | null;
  venue: string;
  startsAt: string;
  endsAt: string;
  bookingClosesAt: string;
};

const initialState: UpdateEventState = {};

export default function EditEventForm(props: Props) {
  const action = updateEventAction.bind(null, props.eventId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="version" value={props.version} />

      <div>
        <label className="mb-2 block text-sm font-semibold">Event title</label>
        <input
          name="title"
          required
          maxLength={200}
          defaultValue={props.title}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Description</label>
        <textarea
          name="description"
          rows={5}
          defaultValue={props.description ?? ""}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Venue</label>
        <input
          name="venue"
          required
          maxLength={255}
          defaultValue={props.venue}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Start date and time</label>
          <input
            type="datetime-local"
            name="starts_at"
            required
            defaultValue={props.startsAt}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">End date and time</label>
          <input
            type="datetime-local"
            name="ends_at"
            required
            defaultValue={props.endsAt}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Booking closes</label>
          <input
            type="datetime-local"
            name="booking_closes_at"
            required
            defaultValue={props.bookingClosesAt}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-violet-600 px-7 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
