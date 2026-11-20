// Is file ka kaam audit logs ko read karna, event/action/date filters lagana, aur latest logs return karna hai.

import type {
    AuditFilters,
    AuditRecord,
    AuditLogsResult,
    AuditShardTable,
} from "./auditTypes";

import { getAuditShardTable } from "./shardRouter";

const PAGE_SIZE = 50;

export interface AuditReader {
    readShard(
        table: AuditShardTable,
        filters: AuditFilters,
        limit: number
    ): Promise<AuditRecord[]>;
}

/**
 * Reads audit logs.
 * Event-specific query reads only one shard.
 * Unfiltered query gathers records from all four shards.
 */
export async function listAuditLogs(
    reader: AuditReader,
    filters: AuditFilters = {}
): Promise<AuditLogsResult> {
    const limit = Math.min(filters.limit ?? PAGE_SIZE, PAGE_SIZE);

    const tables: AuditShardTable[] = filters.eventId
        ? [
            getAuditShardTable(
                filters.eventId,
                undefined
            ),
        ]
        : [
            "audit_logs_0",
            "audit_logs_1",
            "audit_logs_2",
            "audit_logs_3",
        ];

    const results = await Promise.all(
        tables.map((table) =>
            reader.readShard(table, filters, limit)
        )
    );

    const logs = results
        .flat()
        .filter((log) => {
            if (filters.action && log.action !== filters.action) {
                return false;
            }

            if (filters.fromDate) {
                if (new Date(log.createdAt) < new Date(filters.fromDate)) {
                    return false;
                }
            }

            if (filters.toDate) {
                const endDate = new Date(filters.toDate);
                endDate.setHours(23, 59, 59, 999);

                if (new Date(log.createdAt) > endDate) {
                    return false;
                }
            }

            return true;
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, limit);

    return {
        logs,
        nextCursor: logs.length === limit
            ? logs[logs.length - 1].id
            : null,
    };
}
