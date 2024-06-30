"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const action = createSafeActionClient();

export const emialSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    // check ager user hai database me
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // ager existing email barbar nahi  hai email ke return karna hi email not found
    if (existingUser?.email !== email) {
      return { error: "Email not found" };
    }

    return { success: email };
  }
);
