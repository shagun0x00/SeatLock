// Ye M3 dashboard par 4 statistics cards dikhayega:
// - Total Audit Logs
// - Bookings
// - Check-ins
// - Access Denied


import type { AuditRecord } from "../audit/auditTypes";

interface AuditStatsProps {
  logs: AuditRecord[];
}

export default function AuditStats({ logs }: AuditStatsProps) {
  const totalLogs = logs.length;

  const bookings = logs.filter(
    (log) =>
      log.action === "BOOKING_CONFIRMED" ||
      log.action === "BOOKING_CANCELLED"
  ).length;

  const checkIns = logs.filter(
    (log) => log.action === "CHECKIN"
  ).length;

  const accessDenied = logs.filter(
    (log) => log.action === "ACCESS_DENIED"
  ).length;

  const stats = [
    {
      title: "Total Audit Logs",
      value: totalLogs,
      color: "border-blue-500",
    },
    {
      title: "Bookings",
      value: bookings,
      color: "border-green-500",
    },
    {
      title: "Check-ins",
      value: checkIns,
      color: "border-purple-500",
    },
    {
      title: "Access Denied",
      value: accessDenied,
      color: "border-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`rounded-xl border border-gray-200 border-l-4 ${stat.color} bg-white p-5 shadow-sm`}
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
