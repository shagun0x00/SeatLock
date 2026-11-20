import { getSessionUserId } from "./session";
import { findActiveUserById } from "../repositories/user.repository";

export async function getCurrentUser() {
  const userId = await getSessionUserId();

  if (!userId) return null;

  const user = await findActiveUserById(userId);

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}