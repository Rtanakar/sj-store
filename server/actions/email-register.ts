"use server";
import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrpyt from "bcrypt";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";

const action = createSafeActionClient();

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    // We are hasing our password
    const hashedPassword = await bcrpyt.hash(password, 10);

    // check karega ki existing user hai ki nahi
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // ager existing user hai to error dena hai ki email already use
    if (existingUser) {
      // ager existing user nahi hai to email verification karna hai
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    // ager user register nahi hai
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);

    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    // ager existing user nahi hai naya user hai to confirmation email sent bhej do
    return { success: "Confirmation Email Sent!" };
  }
);
