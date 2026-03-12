"use client";

import { useSignUp } from "@clerk/nextjs";
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

type SignupErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
  verificationCode?: string;
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");
  return { firstName, lastName };
};

export default function SignupPage() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const nextErrors: SignupErrors = {};
    if (!formData.name) nextErrors.name = "Name is required";
    if (!formData.email) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    if (!formData.confirmPassword)
      nextErrors.confirmPassword = "Confirm your password";
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (!signUp) throw new Error("Signup is not ready yet.");
      const { firstName, lastName } = splitName(formData.name);
      const { error } = await signUp.password({
        emailAddress: formData.email,
        password: formData.password,
        firstName,
        lastName: lastName || undefined,
      });
      if (error) throw error;

      if (signUp.status === "complete") {
        const finalizeResult = await signUp.finalize();
        if (finalizeResult.error) throw finalizeResult.error;
        toast.success("Account created successfully");
        router.push("/dashboard");
      } else {
        const emailCodeResult = await signUp.verifications.sendEmailCode();
        if (emailCodeResult.error) throw emailCodeResult.error;
        setStage("verify");
        toast.success("Check your email for the verification code.");
      }
    } catch (error) {
      const message = getClerkErrorMessage(error);
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verificationCode.trim()) {
      setErrors({ verificationCode: "Enter the verification code." });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      if (!signUp) throw new Error("Signup is not ready yet.");
      const { error } = await signUp.verifications.verifyEmailCode({
        code: verificationCode.trim(),
      });
      if (error) throw error;

      if (signUp.status === "complete") {
        const finalizeResult = await signUp.finalize();
        if (finalizeResult.error) throw finalizeResult.error;
        toast.success("Email verified. Welcome to ScriptureAI!");
        router.push("/dashboard");
      } else {
        throw new Error("Verification incomplete. Please try again.");
      }
    } catch (error) {
      const message = getClerkErrorMessage(error);
      setErrors({ verificationCode: message });
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!signUp) return;
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      toast.error(getClerkErrorMessage(error));
      return;
    }
    toast.success("New verification code sent.");
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
          stage === "form" ? (
            <div className="text-sm text-slate-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-slate-900 transition hover:text-slate-700"
              >
                Log in
              </a>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setStage("form")}
              className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            >
              Use a different email
            </button>
          )
        }
      >
        <AuthHeader
          title={stage === "form" ? "Create your account" : "Verify your email"}
          subtitle={
            stage === "form"
              ? "Start exploring ScriptureAI today."
              : "Enter the 6-digit code sent to your inbox."
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

        {stage === "form" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              error={errors.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Your full name"
            />
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
            <PasswordInput
              label="Password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              error={errors.password}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Create a password"
            />
            <PasswordInput
              label="Confirm password"
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
              placeholder="Re-enter your password"
            />
            <div id="clerk-captcha" className="my-2" />

            <button
              type="submit"
              disabled={isLoading || fetchStatus === "fetching"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              )}
              Create Account
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerify}>
            <Input
              label="Verification code"
              name="verificationCode"
              value={verificationCode}
              error={errors.verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              placeholder="Enter 6-digit code"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isVerifying && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
              )}
              Verify Email
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Resend code
            </button>
          </form>
        )}
      </AuthForm>
    </motion.div>
  );
}
