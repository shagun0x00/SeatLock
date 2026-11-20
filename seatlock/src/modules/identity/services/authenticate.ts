import bcrypt from "bcryptjs";
import { findUserByEmail } from "../repositories/user.repository";

export async function authenticate(
  email: string,
  password: string,
) {
  const user = await findUserByEmail(email);

  if (!user || !user.is_active) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash,
  );

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}