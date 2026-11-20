


import { getAuditShardTable } from "./shardRouter";

type ShardName =
  | "audit_logs_0"
  | "audit_logs_1"
  | "audit_logs_2"
  | "audit_logs_3";

export function findEventsForAllShards() {
  const found: Partial<Record<ShardName, string>> = {};

  for (let i = 1; i <= 1000; i++) {
    const eventId = `test-event-${i}`;
    const shard = getAuditShardTable(eventId, undefined);

    if (!found[shard]) {
      found[shard] = eventId;
    }

    if (Object.keys(found).length === 4) {
      break;
    }
  }

  return found;
}

export function verifyAllShards() {
  const results = findEventsForAllShards();

  return {
    results,
    passed: Object.keys(results).length === 4,
    totalShardsFound: Object.keys(results).length,
  };
}

export function getActorShardResult() {
  return getAuditShardTable(undefined, "user-101");
}

