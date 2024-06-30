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
import { LoginSchema } from "@/types/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Link from "next/link";
function LoginForm() {
  // Use Form me type schema add karna hota hai
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //   ye form submit ke liye hai
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
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

              {/* Forget Password */}
              <Button className="px-0" size={"sm"} variant={"link"} asChild>
                <Link href="/auth/reset">Forget your password</Link>
              </Button>
            </div>

            {/* Form Submit Button */}
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}

export default LoginForm;
