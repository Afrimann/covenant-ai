"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export default function AuthForm({ children, footer, className }: AuthFormProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
        className
      )}
    >
      <div className="space-y-6">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}
