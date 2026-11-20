"use client";

import { useState } from "react";
import type { AuditFilters as AuditFiltersType, AuditRecord } from "@/modules/m3/audit/auditTypes";
import AuditFilters from "./AuditFilters";
import AuditTable from "./AuditTable";

export default function AuditLogExplorer({ logs }: { logs: AuditRecord[] }) {
  const [filters, setFilters] = useState<AuditFiltersType>({});

  const filtered = logs.filter((log) => {
    if (filters.eventId && log.eventId !== filters.eventId) return false;
    if (filters.action && log.action !== filters.action) return false;
    if (filters.fromDate && new Date(log.createdAt) < new Date(filters.fromDate)) return false;
    if (filters.toDate) {
      const end = new Date(filters.toDate);
      end.setHours(23, 59, 59, 999);
      if (new Date(log.createdAt) > end) return false;
    }
    return true;
  });

  return (
    <>
      <AuditFilters filters={filters} onChange={setFilters} />
      <AuditTable logs={filtered} />
    </>
  );
}
