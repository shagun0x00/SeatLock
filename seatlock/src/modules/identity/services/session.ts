import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "seatlock_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: bigint) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  await prisma.sessions.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + SESSION_DURATION),
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.sessions.updateMany({
      where: {
        token_hash: hashToken(token),
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<bigint | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const session = await prisma.sessions.findFirst({
    where: {
      token_hash: hashToken(token),
      revoked_at: null,
      expires_at: { gt: new Date() },
    },
    select: {
      user_id: true,
    },
  });

  return session?.user_id ?? null;
}