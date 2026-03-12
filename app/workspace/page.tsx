export default function WorkspaceDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome to ScriptureAI</h2>
        <p className="mt-2 text-sm text-slate-500">
          Your AI-powered biblical research assistant is ready to help.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Studies", "Sermons", "Insights"].map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">12</p>
            <p className="mt-1 text-xs text-slate-500">This month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
