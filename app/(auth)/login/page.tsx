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

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [isOauthLoading, setIsOauthLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const nextErrors: LoginErrors = {};
    if (!formData.email) nextErrors.email = "Email is required";
    if (!formData.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signIn.password({
        emailAddress: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      if (signIn.status === "complete") {
        const finalizeResult = await signIn.finalize();
        if (finalizeResult.error) throw finalizeResult.error;
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        setErrors({ form: "Additional verification is required." });
        toast.error("Additional verification required.");
      }
    } catch (error) {
      const message = getClerkErrorMessage(error);
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsOauthLoading(true);

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectCallbackUrl: "/sso-callback",
      });
      if (error) throw error;
    } catch (error) {
      const message = getClerkErrorMessage(error);
      toast.error(message);
      setIsOauthLoading(false);
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
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <div className="flex items-center justify-between">
              <a
                href="/forgot-password"
                className="text-slate-600 transition hover:text-slate-900"
              >
                Forgot password?
              </a>
              <a
                href="/signup"
                className="text-slate-900 transition hover:text-slate-700"
              >
                Sign up
              </a>
            </div>
            <p className="text-xs text-slate-400">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        }
      >
        <AuthHeader
          title="Welcome back"
          subtitle="Log in to continue your ScriptureAI research."
        />

        {errors.form && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600"
          >
            {errors.form}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            value={formData.password}
            error={errors.password}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="Enter your password"
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
            Log In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.3em] text-slate-400">
            <span className="bg-white px-3">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={isOauthLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isOauthLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M21.8 12.2c0-.8-.1-1.6-.3-2.4H12v4.6h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.7 3.1-4.3 3.1-7.9Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.7 0 5-0.9 6.7-2.5l-3.2-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.9-4.2H2.8v2.7A10 10 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M6.1 13.7A6 6 0 0 1 6 12c0-.6.1-1.1.2-1.7V7.6H2.8A10 10 0 0 0 2 12c0 1.6.4 3.2 1.1 4.4l3-2.7Z"
                fill="#FBBC05"
              />
              <path
                d="M12 6.8c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3.9 14.7 3 12 3a10 10 0 0 0-9.2 4.6l3 2.7C7 8.6 9.3 6.8 12 6.8Z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continue with Google
        </button>
      </AuthForm>
    </motion.div>
  );
}
