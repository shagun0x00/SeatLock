import { redirect } from "next/navigation";
import { getCurrentUser } from "./getCurrentUser";
import { authorize } from "./authorize";
import type { UserRole } from "../types";

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();

  try {
    authorize(user.role, roles);
  } catch {
    redirect("/unauthorized");
  }

  return user;
}