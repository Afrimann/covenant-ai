export default function FeaturesPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {
        [
          "Scripture-grounded answers",
          "Multi-agent theological research",
          "Sermon and lesson planning",
          "Historical context summaries",
        ].map((feature) => (
          <div
            key={feature}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
          >
            <p className="text-sm font-semibold text-slate-900">{feature}</p>
            <p className="mt-2 text-xs text-slate-500">
              Replace with dynamic feature descriptions.
            </p>
          </div>
        ))
      }
    </div>
  );
}
