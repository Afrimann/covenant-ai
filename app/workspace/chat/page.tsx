export default function AIStudyChatPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      <h3 className="text-lg font-semibold text-slate-900">AI Study Chat</h3>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Ask a question to start your study conversation.
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          Your AI responses will appear here.
        </div>
      </div>
    </div>
  );
}
