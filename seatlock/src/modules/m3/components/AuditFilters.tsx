"use client";

import type { AuditFilters, AuditAction } from "../audit/auditTypes";

interface AuditFiltersProps {
    filters: AuditFilters;
    onChange: (filters: AuditFilters) => void;
}

const actions: AuditAction[] = [
    "LOGIN",
    "LOGIN_FAILED",
    "SEAT_HOLD",
    "SEAT_HOLD_REJECTED",
    "HOLD_EXPIRED",
    "BOOKING_CONFIRMED",
    "BOOKING_CANCELLED",
    "EVENT_UPDATED",
    "CHECKIN",
    "ACCESS_DENIED",
];

export default function AuditFilters({ filters, onChange }: AuditFiltersProps) {
    function updateFilter(
        key: "eventId" | "fromDate" | "toDate",
        value: string
    ) {
        onChange({
            ...filters,
            [key]: value || undefined,
            cursor: undefined,
        });
    }

    function resetFilters() {
        onChange({});
    }

    const inputStyle =
        "mt-2 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-base font-medium text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    const labelStyle = "block text-sm font-bold text-gray-900";

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md md:p-7">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
                Filter Audit Logs
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {/* Event ID */}
                <div>
                    <label className={labelStyle}>Event ID</label>
                    <input
                        type="text"
                        value={filters.eventId ?? ""}
                        onChange={(e) => updateFilter("eventId", e.target.value)}
                        placeholder="Enter Event ID"
                        className={inputStyle}
                    />
                </div>

                {/* Action */}
                <div>
                    <label className={labelStyle}>Action</label>
                    <select
                        value={filters.action ?? ""}
                        onChange={(e) =>
                            onChange({
                                ...filters,
                                action: (e.target.value || undefined) as AuditAction | undefined,
                                cursor: undefined,
                            })
                        }
                        className={inputStyle}
                    >
                        <option value="">All Actions</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>

                {/* From Date */}
                <div>
                    <label className={labelStyle}>From Date</label>
                    <input
                        type="date"
                        value={filters.fromDate ?? ""}
                        onChange={(e) => updateFilter("fromDate", e.target.value)}
                        className={inputStyle}
                    />
                </div>

                {/* To Date */}
                <div>
                    <label className={labelStyle}>To Date</label>
                    <input
                        type="date"
                        value={filters.toDate ?? ""}
                        onChange={(e) => updateFilter("toDate", e.target.value)}
                        className={inputStyle}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border-2 border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-100 focus:ring-2 focus:ring-blue-300"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}