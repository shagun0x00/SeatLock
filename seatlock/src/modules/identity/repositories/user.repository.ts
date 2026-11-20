import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export async function findActiveUserById(id: bigint) {
  return prisma.users.findFirst({
    where: {
      id,
      is_active: true,
    },
  });
}