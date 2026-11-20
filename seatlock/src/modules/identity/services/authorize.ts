import type { UserRole } from "../types";

export function hasRole(
  userRole: UserRole,
  allowedRoles: UserRole[],
) {
  return allowedRoles.includes(userRole);
}

export function authorize(
  userRole: UserRole,
  allowedRoles: UserRole[],
) {
  if (!hasRole(userRole, allowedRoles)) {
    throw new Error("FORBIDDEN");
  }
}