"use server";
import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrpyt from "bcrypt";

const action = createSafeActionClient();

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    const hashedPassword = await bcrpyt.hash(password, 10);

    console.log(hashedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // ager existing user hai to error dena hai ki email already use
    if (existingUser) {
      // ager existing user nahi hai to email verification karna hai
      // if (!existingUser.emailVerified) {
      // const verificationToken =
      // }
      return { error: "Email already in use" };
    }
    return { success: "yayyy" };
  }
);
