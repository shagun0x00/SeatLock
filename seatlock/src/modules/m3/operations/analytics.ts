// Iska kaam audit logs se analytics calculate karna hoga—action counts, failed logins, booking activity, check-in count, aur access denied.




import type { AuditRecord } from "../audit/auditTypes";

export interface AuditAnalytics {
  totalLogs: number;
  successfulLogins: number;
  failedLogins: number;
  bookingsConfirmed: number;
  bookingsCancelled: number;
  checkIns: number;
  accessDenied: number;
}

export function calculateAuditAnalytics(
  logs: AuditRecord[]
): AuditAnalytics {
  return {
    totalLogs: logs.length,

    successfulLogins: logs.filter(
      (log) => log.action === "LOGIN"
    ).length,

    failedLogins: logs.filter(
      (log) => log.action === "LOGIN_FAILED"
    ).length,

    bookingsConfirmed: logs.filter(
      (log) => log.action === "BOOKING_CONFIRMED"
    ).length,

    bookingsCancelled: logs.filter(
      (log) => log.action === "BOOKING_CANCELLED"
    ).length,

    checkIns: logs.filter(
      (log) => log.action === "CHECKIN"
    ).length,

    accessDenied: logs.filter(
      (log) => log.action === "ACCESS_DENIED"
    ).length,
  };
}
