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
import { Input } from "@/components/ui/input";
import AuthCard from "./auth-card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { newPassword } from "@/server/actions/new-password";
import { ResetSchema } from "@/types/reset-schema";
import { reset } from "@/server/actions/password-reset";
import { toast } from "sonner";

function ResetForm() {
  // Use Form me type schema add karna hota hai
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  //   Error message show karne ke liye state
  const [error, setError] = useState<string>("");

  //   Success message show karne ke liye state
  const [success, setSuccess] = useState<string>("");

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data?.error) {
        setError(data.error);
        toast.error(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        toast.success(data.success);
      }
    },
  });

  //   ye form submit ke liye hai
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forget your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div>
        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {/* Password */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sjstore@gmail.com"
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* From Success */}
              <FormSuccess message={success} />

              {/* Form Error */}
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
              Reset Password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}

export default ResetForm;
