// getAuditShardTable() se decide karta hai ki log kis shard table mein jayega.



// Unique audit ID generate karta hai.



// Timestamp add karta hai.



// Metadata empty ho to {} rakhta hai.



// writer.insertAudit() ke through selected table mein record bhejta hai.
import type { AuditInput, AuditRecord } from "./auditTypes";
import { getAuditShardTable } from "./shardRouter";

/**
 * Database adapter interface.
 * Prisma integration will be connected later.
 */
export interface AuditWriter {
    insertAudit(
        table: string,
        record: AuditRecord
    ): Promise<void>;
}

/**
 * Creates an audit record and routes it to the correct shard.
 */
export async function writeAudit(
    data: AuditInput,
    writer: AuditWriter
): Promise<AuditRecord> {
    const table = getAuditShardTable(data.eventId, data.actorId);

    const record: AuditRecord = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        metadata: data.metadata ?? {},
    };

    await writer.insertAudit(table, record);

    return record;
}
