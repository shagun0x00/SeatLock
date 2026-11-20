import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { AuditRecord } from "@/modules/m3/audit/auditTypes";
import AuditStats from "@/modules/m3/components/AuditStats";
import AuditLogExplorer from "@/modules/m3/components/AuditLogExplorer";

export const instant = false;

async function AuditLogsContent() {
  const [shard0, shard1, shard2, shard3] = await Promise.all([
    prisma.audit_logs_0.findMany({ take: 100, orderBy: { created_at: "desc" } }),
    prisma.audit_logs_1.findMany({ take: 100, orderBy: { created_at: "desc" } }),
    prisma.audit_logs_2.findMany({ take: 100, orderBy: { created_at: "desc" } }),
    prisma.audit_logs_3.findMany({ take: 100, orderBy: { created_at: "desc" } }),
  ]);

  const logs: AuditRecord[] = [...shard0, ...shard1, ...shard2, ...shard3]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 100)
    .map((log) => ({
      id: log.id.toString(),
      actorId: log.actor_id?.toString() ?? "system",
      eventId: log.event_id?.toString(),
      action: log.action as AuditRecord["action"],
      targetId: null,
      metadata:
        typeof log.details === "object" &&
        log.details !== null &&
        !Array.isArray(log.details)
          ? (log.details as Record<string, unknown>)
          : {},
      createdAt: log.created_at,
    }));

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs font-bold tracking-[0.18em] text-violet-600">AUDIT & OPERATIONS</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950 md:text-4xl">Audit dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Review activity across all four audit shards.</p>
        </header>
        <AuditStats logs={logs} />
        <AuditLogExplorer logs={logs} />
      </div>
    </main>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Loading audit logs…</p>}>
      <AuditLogsContent />
    </Suspense>
  );
}
