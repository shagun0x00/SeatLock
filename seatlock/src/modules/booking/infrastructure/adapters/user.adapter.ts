
export type UserAccountStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "DELETED";

/**
 * User record returned by the external user-management system.
 */
export interface ExternalUserRecord {
  userId: string;
  status: UserAccountStatus;
}

/**
 * User information exposed to the Booking Module.
 */
export interface BookingUser {
  id: string;
  isActive: boolean;
}

/**
 * Contract implemented by the external user-management provider.
 */
export interface UserIdentityProvider {
  getUserById(
    userId: string,
  ): Promise<ExternalUserRecord | null>;
}

/**
 * Application-facing user lookup contract.
 */
export interface UserDirectory {
  findById(userId: string): Promise<BookingUser | null>;
}

export class UserAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserAdapterError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Converts external user records into the format
 * understood by the Booking Module.
 */
export class UserAdapter implements UserDirectory {
  constructor(
    private readonly provider: UserIdentityProvider,
  ) {}

  async findById(userId: string): Promise<BookingUser | null> {
    if (
      typeof userId !== "string" ||
      userId.trim().length === 0
    ) {
      throw new UserAdapterError(
        "A valid user ID is required.",
      );
    }

    const normalizedUserId = userId.trim();

    const record = await this.provider.getUserById(
      normalizedUserId,
    );

    if (record === null) {
      return null;
    }

    if (
      typeof record.userId !== "string" ||
      record.userId.trim().length === 0
    ) {
      throw new UserAdapterError(
        "User provider returned an invalid user ID.",
      );
    }

    if (record.userId.trim() !== normalizedUserId) {
      throw new UserAdapterError(
        "User provider returned a different user.",
      );
    }

    const validStatuses: UserAccountStatus[] = [
      "ACTIVE",
      "SUSPENDED",
      "DELETED",
    ];

    if (!validStatuses.includes(record.status)) {
      throw new UserAdapterError(
        "User provider returned an invalid account status.",
      );
    }

    return Object.freeze({
      id: normalizedUserId,
      isActive: record.status === "ACTIVE",
    });
  }
}
