"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import AuthCard from "./auth-card";
import * as z from "zod";
import { LoginSchema } from "@/types/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { emialSignIn } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { toast } from "sonner";

function LoginForm() {
  // Use Form me type schema add karna hota hai
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //   Error message show karne ke liye state
  const [error, setError] = useState<string>("");

  //   Success message show karne ke liye state
  const [success, setSuccess] = useState<string>("");

  //   Two factor token ke liye hai
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  //   next safe action use to get emailsignin Action
  const { execute, status } = useAction(emialSignIn, {
    onSuccess(data) {
      if (data?.error) {
        setError(data.error);
        toast.error(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        toast.success(data.success);
      }
      if (data.twoFactor) {
        setShowTwoFactor(true);
        toast.success(data.twoFactor);
      }
    },
  });

  //   ye form submit ke liye hai
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showShocials
    >
      <div>
        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {/* OTP */}
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        We&apos;ve sent you a two factor OTP to your email.
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          disabled={status === "executing"}
                          {...field}
                          maxLength={6}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Ager two fator token nahi hai to ye dikhao  */}
              {!showTwoFactor && (
                <>
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="sjstore@gmail.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="************"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Success Form */}
              <FormSuccess message={success} />

              {/* Error Form */}
              <FormError message={error} />

              {/* Forget Password */}
              <Button className="px-0" size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forget your password</Link>
              </Button>
            </div>

            {/* Form Submit Button */}
            <Button
              type="submit"
              className={cn(
                "w-full my-4",
                status === "executing" && "animate-pulse"
              )}
            >
              {showTwoFactor ? "Verify" : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}

export default LoginForm;
