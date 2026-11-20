"use client";

import { useState } from "react";
import {
    validateCheckIn,
    type CheckInInput,
} from "@/modules/m3/operations/checkIn";

export default function CheckInForm() {
    const [attendeeId, setAttendeeId] = useState("");
    const [eventId, setEventId] = useState("");
    const [organizerId, setOrganizerId] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const input: CheckInInput = {
            attendeeId,
            eventId,
            organizerId,
        };

        const result = validateCheckIn(input);
        setMessage(result.message);
    }

    const inputStyle =
        "mt-2 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md md:p-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
                Attendee Check-in
            </h2>

            <p className="mb-7 text-base text-gray-600">
                Enter attendee details to validate check-in.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-base font-semibold text-gray-900">
                        Attendee ID
                    </label>
                    <input
                        value={attendeeId}
                        onChange={(e) => setAttendeeId(e.target.value)}
                        placeholder="Enter attendee ID"
                        className={inputStyle}
                    />
                </div>

                <div>
                    <label className="block text-base font-semibold text-gray-900">
                        Event ID
                    </label>
                    <input
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        placeholder="Enter event ID"
                        className={inputStyle}
                    />
                </div>

                <div>
                    <label className="block text-base font-semibold text-gray-900">
                        Organizer ID
                    </label>
                    <input
                        value={organizerId}
                        onChange={(e) => setOrganizerId(e.target.value)}
                        placeholder="Enter organizer ID"
                        className={inputStyle}
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                >
                    Validate Check-in
                </button>
            </form>

            {message && (
                <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-base font-medium text-blue-900">
                    {message}
                </div>
            )}
        </div>
    );
}