"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import bcrpyt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const action = createSafeActionClient();

export const newPassword = action(
  NewPasswordSchema,
  async ({ password, token }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);
    // To check the token
    // ager token nahi hai to error de do
    if (!token) {
      return { error: "Missing Token" };
    }

    // hame check karna hai ki ager token valid hai to
    const existingToken = await getPasswordResetTokenByToken(token);
    // ager existing token nahi hai to
    if (!existingToken) {
      return { error: "Token not found" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    // ager expire hogaya hai token to error de do
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    // ager existing user nahi hai to error de do
    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedPassword = await bcrpyt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, existingUser.id));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingUser.id));
    });
    // return { success: "password updated" };
    return { success: "Paaword updated 🎊" };
  }
);
