"use server";

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action(SettingsSchema, async (values) => {
  const user = await auth();

  //   ager user nahi hai to error de do
  if (!user) {
    return { error: "User not found" };
  }

  //   ye user ko pata lagane ke liye hai
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });

  //   database me user nahi hai to error de do
  if (!dbUser) {
    return { error: "User not found" };
  }
  // ye check karega ki google se ya kisi aur platform se sign in hai ya nahi
  if (user.user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  //   ye comparison karega password ka
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    // ager password match nahi karta hai hai error de do
    if (!passwordMatch) {
      return { error: "Password does not match" };
    }

    // ye same password ke liye hai
    const samePassword = await bcrypt.compare(
      values.newPassword,
      dbUser.password
    );
    // ager same password hai to error de do
    if (samePassword) {
      return { error: "New password is the same as the old password" };
    }

    // update password ke liye hai
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  //   ye update karega name, password, image aur two factor on karna
  const updatedUser = await db
    .update(users)
    .set({
      twoFactorEnabled: values.isTwoFactorEnabled,
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image,
    })
    .where(eq(users.id, dbUser.id));
  revalidatePath("/dashboard/settings");
  return { success: "Settings updated" };
});
