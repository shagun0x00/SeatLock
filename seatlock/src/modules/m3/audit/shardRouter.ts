// har audit log ko 4 database tables mein se sahi table assign karna.

import { createHash } from "crypto";
import type {
  AuditShardNumber,
  AuditShardTable,
} from "./auditTypes";

/**
 * Generates a stable hash and maps it to one of 4 audit shards.
 */
function hashToShard(key: string): AuditShardNumber {
  const hash = createHash("sha256")
    .update(key)
    .digest();

  const shard = hash.readUInt32BE(0) % 4;

  return shard as AuditShardNumber;
}

/**
 * Determines which shard an audit record belongs to.
 *
 * Event-related actions  -> eventId
 * Non-event actions     -> actorId
 */
export function getAuditShard(
  eventId?: string | null,
  actorId?: string | null
): AuditShardNumber {
  const key = eventId?.trim() || actorId?.trim();

  if (!key) {
    throw new Error("eventId or actorId is required for audit sharding");
  }

  return hashToShard(key);
}

/**
 * Returns the corresponding audit table name.
 */
export function getAuditShardTable(
  eventId?: string | null,
  actorId?: string | null
): AuditShardTable {
  const shard = getAuditShard(eventId, actorId);

  return `audit_logs_${shard}` as AuditShardTable;
}
