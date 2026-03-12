"use client";

import { useSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import AuthHeader from "@/components/AuthHeader";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { getClerkErrorMessage } from "@/lib/utils";

type ResetErrors = {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ResetErrors>({});
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  const validateRequest = () => {
    const nextErrors: ResetErrors = {};
    if (!formData.email) nextErrors.email = "Email is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateReset = () => {
    const nextErrors: ResetErrors = {};
    if (!formData.code) nextErrors.code = "Verification code is required";
    if (!formData.password) nextErrors.password = "New password is required";
    if (!formData.confirmPassword)
      nextErrors.confirmPassword = "Confirm your new password";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      nextErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateRequest()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error: createError } = await signIn.create({
        identifier: formData.email,
      });
      if (createError) throw createError;

      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) throw error;

      toast.success("Reset code sent to your email.");
      setStep("reset");
    } catch (error) {
      const message = getClerkErrorMessage(error);
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateReset()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: formData.code,
        });
      if (verifyError) throw verifyError;

      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: formData.password,
        });
      if (submitError) throw submitError;

      if (signIn.status === "complete") {
        const finalizeResult = await signIn.finalize();
        if (finalizeResult.error) throw finalizeResult.error;
        toast.success("Password updated successfully");
        router.push("/dashboard");
      } else {
        setErrors({ form: "Unable to reset password." });
        toast.error("Unable to reset password.");
      }
    } catch (error) {
      const message = getClerkErrorMessage(error);
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full max-w-md"
    >
      <AuthForm
        footer={
          <div className="text-sm text-slate-500">
            Remembered your password?{" "}
            <a
              href="/login"
              className="font-semibold text-slate-900 transition hover:text-slate-700"
            >
              Log in
            </a>
          </div>
        }
      >
        <AuthHeader
          title="Reset your password"
          subtitle={
            step === "request"
              ? "We will email you a verification code."
              : "Enter the code and choose a new password."
          }
        />

        {errors.form && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600"
          >
            {errors.form}
          </div>
        )}

        {step === "request" ? (
          <form className="space-y-4" onSubmit={handleRequest}>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              error={errors.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={isLoading || fetchStatus === "fetching"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              )}
              Send reset code
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleReset}>
            <Input
              label="Verification code"
              name="code"
              value={formData.code}
              error={errors.code}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, code: event.target.value }))
              }
              placeholder="Enter the code"
            />
            <PasswordInput
              label="New password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              error={errors.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Create a new password"
            />
            <PasswordInput
              label="Confirm new password"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              placeholder="Re-enter your new password"
            />
            <button
              type="submit"
              disabled={isLoading || fetchStatus === "fetching"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              )}
              Update password
            </button>
          </form>
        )}
      </AuthForm>
    </motion.div>
  );
}
