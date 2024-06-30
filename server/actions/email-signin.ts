"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const emialSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    console.log(email, password, code);

    return { email };
  }
);
