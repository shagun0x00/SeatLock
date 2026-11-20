"use server";

import { redirect } from "next/navigation";
import { destroySession } from "../services/session";

export async function logout() {
  await destroySession();
  redirect("/login");
}