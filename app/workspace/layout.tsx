"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/workspace",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M3 11h8V3H3v8Zm0 10h8v-8H3v8Zm10 0h8V13h-8v8Zm0-18v8h8V3h-8Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "devotions",
    label: "Daily Devotions",
    href: "/workspace/daily-devotions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M6 4h12a2 2 0 0 1 2 2v14l-8-3-8 3V6a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "AI Study Chat",
    href: "/workspace/chat",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M4 5h16v10H7l-3 3V5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "sermon",
    label: "Sermon Builder",
    href: "/workspace/sermon-builder",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 3v18M5 8h14M7 6h10M7 18h10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "features",
    label: "Features",
    href: "/workspace/features",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="m12 2 3 7h7l-5.5 4.5 2.5 7L12 16l-7 4.5 2.5-7L2 9h7l3-7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/workspace/settings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 2 9.5 6.5 4 7l4 4-1 5 5-2.5 5 2.5-1-5 4-4-5.5-.5L12 2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const pageTransition = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeLabel = useMemo(() => {
    const activeItem = navItems.find((item) => item.href === pathname);
    return activeItem?.label ?? "Workspace";
  }, [pathname]);

  const sidebarWidth = isCollapsed ? 72 : 260;

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ ["--sidebar-width" as string]: `${sidebarWidth}px` }}
    >
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        className="fixed left-0 top-0 hidden h-screen flex-col border-r border-slate-200 bg-white/90 px-4 py-6 pr-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:flex"
      >
        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm">
              SA
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-900">ScriptureAI</p>
                <p className="text-xs text-slate-500">Workspace</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`rounded-full border p-2.5 transition ${
              isCollapsed
                ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            }`}
            aria-label="Toggle sidebar"
          >
            <motion.span
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2.5">
          {navItems.map((item) => {
            const isActive = item.href === pathname;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group relative flex items-center rounded-xl text-sm font-semibold transition-colors ${
                  isCollapsed ? "justify-center px-4 py-3" : "gap-3 px-3 py-2.5"
                } ${
                  !isCollapsed
                    ? isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                    : isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute ${
                      isCollapsed
                        ? "inset-y-0.5 left-1.5 right-1.5 rounded-3xl"
                        : "inset-0 rounded-xl"
                    } bg-slate-900 shadow-sm`}
                  />
                )}
                <span
                  className={`relative z-10 flex items-center justify-center rounded-2xl transition ${
                    isCollapsed ? "h-11 w-11" : "h-10 w-10"
                  } ${!isActive ? "group-hover:bg-slate-100" : ""}`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span className="relative z-10">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          {!isCollapsed ? "AI Workspace ready" : "AI"}
        </div>
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="fixed left-0 top-0 z-50 h-full w-72 border-r border-slate-200 bg-white px-4 py-6 pr-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] md:hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  SA
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">ScriptureAI</p>
                  <p className="text-xs text-slate-500">Workspace</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="Close sidebar"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = item.href === pathname;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="min-h-screen md:pl-[var(--sidebar-width)]">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 shadow-sm md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="Open sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <p className="text-sm font-semibold text-slate-900">{activeLabel}</p>
          <UserMenu user={user} size="sm" />
        </header>

        <main className="px-6 pb-10 pt-6">
          <div className="hidden justify-end md:flex">
            <UserMenu user={user} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageTransition}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mx-auto mt-6 w-full max-w-5xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function UserMenu({
  user,
  size = "md",
}: {
  user: ReturnType<typeof useUser>["user"];
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const letter =
    user?.lastName?.[0] ??
    user?.firstName?.[0] ??
    user?.username?.[0] ??
    "S";
  const sizeClasses = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 ${sizeClasses}`}
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="User avatar" className="h-full w-full object-cover" />
        ) : (
          <span className="font-semibold text-slate-700">{letter}</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
            role="menu"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-slate-900">
                {user?.fullName ?? "ScriptureAI User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
              </p>
            </div>
            <div className="my-2 h-px bg-slate-200" />
            {[
              { label: "Settings", href: "/workspace/settings" },
              { label: "Preferences", href: "/workspace/preferences" },
              { label: "Manage Account", href: "/workspace/account" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-slate-200" />
            <Link
              href="/sign-out"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              role="menuitem"
            >
              Sign out
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
