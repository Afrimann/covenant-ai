export default function SermonBuilderPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-semibold text-slate-900">Sermon Builder</h3>
      <p className="mt-2 text-sm text-slate-500">
        Start a new outline and ScriptureAI will generate the structure and key insights.
      </p>
      <button
        type="button"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Create Outline
      </button>
    </div>
  );
}
