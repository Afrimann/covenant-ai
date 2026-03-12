"use client";

import { cn } from "@/lib/utils";

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export default function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h1 className="font-serif text-3xl font-semibold text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
