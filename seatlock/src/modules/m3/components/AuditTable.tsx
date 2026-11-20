// audit logs ko dashboard mein proper table format mein dikhayega—action, user, event, target, timestamp aur metadata ke saath.
"use client";

import { useState } from "react";
import type { AuditRecord } from "@/modules/m3/audit/auditTypes";

interface AuditTableProps {
    logs: AuditRecord[];
}

const PAGE_SIZE = 5;

export default function AuditTable({ logs }: AuditTableProps) {
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleLogs = logs.slice(startIndex, startIndex + PAGE_SIZE);

    function formatDate(date: Date | string) {
        return new Date(date).toLocaleString("en-IN");
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-900">
                    Audit Logs
                </h2>

                <p className="mt-2 text-base text-gray-600">
                    Activity history and system events
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                    <thead className="bg-gray-100 text-gray-900">
                        <tr>
                            <th className="px-5 py-4 text-sm font-bold">Action</th>
                            <th className="px-5 py-4 text-sm font-bold">Actor ID</th>
                            <th className="px-5 py-4 text-sm font-bold">Event ID</th>
                            <th className="px-5 py-4 text-sm font-bold">Target ID</th>
                            <th className="px-5 py-4 text-sm font-bold">Timestamp</th>
                            <th className="px-5 py-4 text-sm font-bold">Metadata</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleLogs.map((log, index) => (
                            <tr
                                key={log.id}
                                className={`border-t border-gray-200 transition-colors hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <td className="px-5 py-4">
                                    <span className="inline-block rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                                        {log.action}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {log.actorId}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-800">
                                    {log.eventId || "-"}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-800">
                                    {log.targetId || "-"}
                                </td>

                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                                    {formatDate(log.createdAt)}
                                </td>

                                <td className="px-5 py-4">
                                    <pre className="max-w-xs whitespace-pre-wrap break-words rounded-lg bg-gray-100 p-3 text-sm text-gray-800">
                                        {JSON.stringify(log.metadata ?? {}, null, 2)}
                                    </pre>
                                </td>
                            </tr>
                        ))}

                        {visibleLogs.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-base font-medium text-gray-500"
                                >
                                    No audit logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4">
                <p className="text-sm font-medium text-gray-700">
                    {logs.length === 0
                        ? "0 logs"
                        : `Showing ${startIndex + 1}-${Math.min(
                            startIndex + PAGE_SIZE,
                            logs.length
                        )} of ${logs.length} logs`}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-bold text-gray-900">
                        Page {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}