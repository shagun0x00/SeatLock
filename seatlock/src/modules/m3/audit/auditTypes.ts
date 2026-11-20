
/**
 * M3 - Audit & Operations
 * Defines audit actions and audit record types.
 */
// audit system ke types, actions aur audit record structure define karenge
export type AuditAction =
    | "LOGIN"
    | "LOGIN_FAILED"
    | "SEAT_HOLD"
    | "SEAT_HOLD_REJECTED"
    | "HOLD_EXPIRED"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "EVENT_UPDATED"
    | "CHECKIN"
    | "ACCESS_DENIED";

// Extra information attached to an audit log
export type AuditMetadata = Record<string, unknown>;

// Data required to create an audit log
export interface AuditInput {
    actorId: string;
    eventId?: string | null;
    action: AuditAction;
    targetId?: string | null;
    metadata?: AuditMetadata;
}

// Complete audit record stored in database
export interface AuditRecord extends AuditInput {
    id: string;
    createdAt: Date | string;
}

// Shard table numbers: 0, 1, 2, 3
export type AuditShardNumber = 0 | 1 | 2 | 3;

// Shard table names
export type AuditShardTable =
    | "audit_logs_0"
    | "audit_logs_1"
    | "audit_logs_2"
    | "audit_logs_3";

// Filter options for Audit Viewer
export interface AuditFilters {
    eventId?: string;
    action?: AuditAction;
    fromDate?: string;
    toDate?: string;
    cursor?: string;
    limit?: number;
}

// Result returned by Audit Viewer
export interface AuditLogsResult {
    logs: AuditRecord[];
    nextCursor?: string | null;
}
