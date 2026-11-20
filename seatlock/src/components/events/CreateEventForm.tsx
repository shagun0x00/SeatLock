"use client";

import { useActionState } from "react";
import {
  createEventAction,
  type CreateEventState,
} from "@/modules/events/actions/createEvent";

const initialState: CreateEventState = {};

export function CreateEventForm() {
  const [state, formAction, isPending] = useActionState(
    createEventAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-7">
      <section className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Event title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={200}
            required
            placeholder="e.g. Tech Summit 2026"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Description{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Tell attendees what to expect"
            className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="venue"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            maxLength={255}
            required
            placeholder="Main Auditorium"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
          />
        </div>
      </section>

      <section className="border-t border-slate-100 pt-7">
        <p className="mb-5 text-xs font-bold tracking-[0.16em] text-slate-400">
          DATE & BOOKING
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="starts_at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Event starts
            </label>
            <input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ends_at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Event ends
            </label>
            <input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="booking_closes_at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Booking closes
            </label>
            <input
              id="booking_closes_at"
              name="booking_closes_at"
              type="datetime-local"
              required
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
            />
          </div>
        </div>
      </section>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating…" : "Create event"}
        </button>
        <span className="text-xs text-slate-400">
          Your event will be saved as a draft.
        </span>
      </div>
    </form>
  );
}