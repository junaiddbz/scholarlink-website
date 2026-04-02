"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { clientAuth } from "@/lib/firebase-client";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  showSignOut?: boolean;
}

export function AdminTopbar({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  showSignOut = false,
}: AdminTopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-white/75 p-3 dark:border-white/15 dark:bg-slate-900/40">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-white dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : null}
        <div>
          {subtitle ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{subtitle}</p>
          ) : null}
          <h1 className="text-xl font-black text-primary dark:text-white sm:text-2xl">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary/5 dark:border-white/20 dark:text-accent dark:hover:bg-white/10"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {showSignOut ? (
          <button
            type="button"
            className="rounded-xl border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white dark:border-white/20 dark:text-slate-100 dark:hover:bg-white/10"
            onClick={() => signOut(clientAuth)}
          >
            Sign Out
          </button>
        ) : null}
      </div>
    </div>
  );
}
