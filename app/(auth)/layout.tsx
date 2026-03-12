import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-8 py-12 text-white sm:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_20%_10%,rgba(148,163,184,0.2),transparent_65%),radial-gradient(500px_260px_at_80%_0%,rgba(56,189,248,0.12),transparent_70%)]" />
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              ScriptureAI
            </span>
            <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Deep Biblical Research, Powered by AI.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Study scripture, prepare sermons, and explore Christian theology with
              intelligent research tools.
            </p>
          </div>
          <p className="relative z-10 mt-12 text-xs text-white/50">
            Calm, focused authentication inspired by modern AI SaaS.
          </p>
        </div>
        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            {children}
            <div id="clerk-captcha" className="mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
