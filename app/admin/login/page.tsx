"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { clientAuth } from "@/lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signInWithEmailAndPassword(clientAuth, email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-10">
      <div className="mx-auto w-full max-w-md px-4">
        <section className="home-panel rounded-3xl p-6 sm:p-8">
          <AdminTopbar
            title="Sign In"
            subtitle="Admin Access"
            backHref="/"
            backLabel="Back to Site"
          />

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input
              className="form-field w-full"
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <input
              className="form-field w-full"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error ? <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-light disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
