"use client";

import { newVerification } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";
import { toast } from "sonner";

function EmailVerificationForm() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleVerification = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("No token found");
      return;
    }

    newVerification(token).then((data) => {
      if (data?.error) {
        setError(data.error);
        // toast.error(data.error);
      }
      if (data?.success) {
        setSuccess(data.success);
        toast.success(data.success);
        router.push("/auth/login");
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      cardTitle="Verify your account."
    >
      <div className="flex flex-col justify-center items-center w-full">
        <p>{!success && !error ? "Verifying email..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
  );
}

export default EmailVerificationForm;
