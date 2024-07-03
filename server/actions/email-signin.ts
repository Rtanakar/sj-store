"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const action = createSafeActionClient();

export const emialSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    try {
      // check ager user hai database me
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // ager existing email barbar nahi  hai email ke return karna hi email not found
      if (existingUser?.email !== email) {
        return { error: "Email not found" };
      }

      // ager user verified nahi hai to
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Confirmation Email Sent!" };
      }

      // ager user email se login hai to two factor kam karega else kam nahi karega
      if (existingUser.twoFactorEnabled && existingUser.email) {
        // ager user email se login hai to user email me otp bhej do verification ke liye
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          // ager two factor token nahi hai to error de do
          if (!twoFactorToken) {
            return { error: "Invalid Token" };
          }

          // ager two factor token match nahi karta to error de do
          if (twoFactorToken.token !== code) {
            return { error: "Invalid OTP" };
          }

          // ager bheja gaya token expire ho gaya hai to error de do
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Token has expired" };
          }

          // bheja gaya token ak bar use ho gaya hai to automatic delete exipre ho jayega
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          // generate kia gaya token nahi hai to error de do
          if (!token) {
            return { error: "Token not generated!" };
          }

          // ye OTP send karega
          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "Two Factor Token OTP Sent your email📧!" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: email };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Email or Password Incorrect" };
        }
      }
      throw error;
    }
  }
);
