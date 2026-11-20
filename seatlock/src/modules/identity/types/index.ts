export type UserRole = "ADMIN" | "ORGANIZER" | "STUDENT";

export type AuthenticatedUser = {
  id: bigint;
  name: string;
  email: string;
  role: UserRole;
};