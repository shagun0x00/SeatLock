"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "../validators/auth.schema";
import { authenticate } from "../services/authenticate";
import { createSession } from "../services/session";

export type LoginState = {
  error?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const user = await authenticate(
    parsed.data.email,
    parsed.data.password,
  );

  if (!user) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);

  switch (user.role) {
    case "ADMIN":
      redirect("/admin/dashboard");
    case "ORGANIZER":
      redirect("/organizer/dashboard");
    case "STUDENT":
      redirect("/student/dashboard");
  }
}