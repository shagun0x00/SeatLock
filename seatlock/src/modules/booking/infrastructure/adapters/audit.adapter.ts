
export const AUDIT_ACTIONS = [
  "SEATS_HELD",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "HOLDS_EXPIRED",
  "SEATS_BLOCKED",
  "SEATS_UNBLOCKED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export type AuditResourceType =
  | "HOLD"
  | "BOOKING"
  | "SCREENING";

export interface AuditRecord {
  id: string;
  action: AuditAction;
  actorId: string | null;
  resourceType: AuditResourceType;
  resourceId: string;
  screeningId: string | null;
  seatIds: readonly string[];
  occurredAt: string;
}

export interface CreateAuditRecordInput {
  action: AuditAction;
  actorId?: string | null;
  resourceType: AuditResourceType;
  resourceId: string;
  screeningId?: string | null;
  seatIds?: readonly string[];
}

export interface AuditWriter {
  write(record: AuditRecord): Promise<void>;
}

export interface AuditAdapterDependencies {
  writer: AuditWriter;
  generateId: () => string;
  getCurrentTime?: () => Date;
}

export class AuditAdapter {
  constructor(
    private readonly dependencies: AuditAdapterDependencies,
  ) {}

  async record(
    input: CreateAuditRecordInput,
  ): Promise<AuditRecord> {
    this.validateInput(input);

    const {
      writer,
      generateId,
      getCurrentTime = () => new Date(),
    } = this.dependencies;

    const id = generateId();

    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Could not generate a valid audit record ID.");
    }

    const now = getCurrentTime();

    if (
      !(now instanceof Date) ||
      !Number.isFinite(now.getTime())
    ) {
      throw new Error("Audit timestamp must be a valid date.");
    }

    const seatIds = Object.freeze([
      ...(input.seatIds ?? []),
    ]);

    const record: AuditRecord = Object.freeze({
      id: id.trim(),
      action: input.action,
      actorId: input.actorId?.trim() ?? null,
      resourceType: input.resourceType,
      resourceId: input.resourceId.trim(),
      screeningId: input.screeningId?.trim() ?? null,
      seatIds,
      occurredAt: now.toISOString(),
    });

    await writer.write(record);

    return record;
  }

  private validateInput(
    input: CreateAuditRecordInput,
  ): void {
    if (!input || typeof input !== "object") {
      throw new Error("Audit input is required.");
    }

    if (
      !AUDIT_ACTIONS.includes(input.action)
    ) {
      throw new Error("Invalid audit action.");
    }

    if (
      !["HOLD", "BOOKING", "SCREENING"].includes(
        input.resourceType,
      )
    ) {
      throw new Error("Invalid audit resource type.");
    }

    if (
      typeof input.resourceId !== "string" ||
      input.resourceId.trim().length === 0
    ) {
      throw new Error("Audit resource ID is required.");
    }

    if (
      input.actorId !== undefined &&
      input.actorId !== null &&
      (
        typeof input.actorId !== "string" ||
        input.actorId.trim().length === 0
      )
    ) {
      throw new Error("Audit actor ID must be valid.");
    }

    if (
      input.screeningId !== undefined &&
      input.screeningId !== null &&
      (
        typeof input.screeningId !== "string" ||
        input.screeningId.trim().length === 0
      )
    ) {
      throw new Error("Audit screening ID must be valid.");
    }

    if (
      input.seatIds !== undefined &&
      !Array.isArray(input.seatIds)
    ) {
      throw new Error("Audit seat IDs must be an array.");
    }

    const seatIds = input.seatIds ?? [];

    for (const seatId of seatIds) {
      if (
        typeof seatId !== "string" ||
        seatId.trim().length === 0
      ) {
        throw new Error("Every audit seat ID must be valid.");
      }
    }

    if (new Set(seatIds).size !== seatIds.length) {
      throw new Error("Duplicate audit seat IDs are not allowed.");
    }
  }
}
