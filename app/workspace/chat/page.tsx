"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type ChatMessage = {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function AIStudyChatPage() {
  const { user } = useUser();
  const userId = user?.id;

  const chats = useQuery(api.chats.listChatsByUser, userId ? { userId } : "skip");
  const createChat = useMutation(api.chats.createChat);
  const sendMessage = useAction(api.messages.sendMessage);

  const [activeChatId, setActiveChatId] = useState<Id<"chats"> | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [streamingTarget, setStreamingTarget] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const messages = useQuery(
    api.messages.listMessagesByChat,
  activeChatId ? { chatId: activeChatId as Id<"chats"> } : "skip"
  ) as ChatMessage[] | undefined;

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeChatId && chats && chats.length > 0) {
      setActiveChatId(chats[0]._id);
    }
  }, [activeChatId, chats]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const displayedMessages = useMemo(() => {
    if (!messages) {
      return [];
    }
    if (!streamingText) {
      return messages;
    }
    const trimmed = [...messages];
    if (trimmed.length > 0 && trimmed[trimmed.length - 1].role === "assistant") {
      trimmed.pop();
    }
    return [
      ...trimmed,
      {
        _id: "streaming",
        role: "assistant" as const,
        content: streamingText,
        createdAt: Date.now(),
      },
    ];
  }, [messages, streamingText]);

  const handleNewChat = async () => {
    if (!userId) return;
    const chat = await createChat({ userId });
    if (chat) {
      setActiveChatId(chat._id);
    }
  };

  const startStreaming = (text: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStreamingTarget(text);
    setStreamingText("");
    let index = 0;
    const step = Math.max(2, Math.floor(text.length / 140));
    intervalRef.current = setInterval(() => {
      index = Math.min(text.length, index + step);
      setStreamingText(text.slice(0, index));
      if (index >= text.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setTimeout(() => {
          setStreamingText(null);
          setStreamingTarget(null);
        }, 300);
      }
    }, 20);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChatId || !userId || isSending) return;
    setIsSending(true);
    setErrorMessage(null);
    const content = input.trim();
    setInput("");
    try {
      const result = await sendMessage({ chatId: activeChatId, userId, content });
      startStreaming(result.response);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="flex h-[72vh] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Chats</h3>
          <button
            type="button"
            onClick={handleNewChat}
            disabled={!userId}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            New Chat
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
          {!userId && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Sign in to create and save chats.
            </div>
          )}
          {chats?.map((chat) => {
            const isActive = chat._id === activeChatId;
            return (
              <button
                key={chat._id}
                type="button"
                onClick={() => setActiveChatId(chat._id)}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                <span className="block truncate">{chat.title}</span>
              </button>
            );
          })}
          {chats && chats.length === 0 && userId && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Start a new study chat to see your history.
            </div>
          )}
        </div>
      </aside>

      <section className="flex h-[72vh] flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
        <header className="border-b border-slate-200 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            ScriptureAI
          </p>
          <h3 className="text-lg font-semibold text-slate-900">AI Study Chat</h3>
          <p className="text-sm text-slate-500">
            Ask questions grounded in Scripture and trusted Christian sources.
          </p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {!activeChatId && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Create a new chat to begin.
            </div>
          )}

          {activeChatId && displayedMessages.length === 0 && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Ask a question to start your study conversation.
            </div>
          )}

          {displayedMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message._id}
                variants={messageVariants}
                initial="hidden"
                animate="show"
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                  isUser
                    ? "ml-auto bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {message.content}
              </motion.div>
            );
          })}

          {isSending && !streamingTarget && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              The assistant is preparing a response...
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Scripture, doctrine, or theology..."
              className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400"
              disabled={!activeChatId || isSending}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !activeChatId || isSending}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Press Enter to send, Shift + Enter for a new line.
          </p>
        </div>
      </section>
    </div>
  );
}
