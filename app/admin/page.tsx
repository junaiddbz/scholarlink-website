"use client";

import Link from "next/link";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";

const sections = [
  { href: "/admin/categories", label: "Manage Categories", detail: "Create, update, archive, and restore categories." },
  { href: "/admin/courses", label: "Manage Courses", detail: "Create, update, archive, and restore course records." },
  { href: "/admin/faculty", label: "Manage Faculty", detail: "Create, update, archive, and restore faculty profiles." },
  { href: "/admin/reviews", label: "Manage Reviews", detail: "Create, update, feature, and publish student reviews." },
  { href: "/admin/announcements", label: "Manage Announcements", detail: "Create rotating homepage updates with publish and expiry schedules." },
];

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <main className="min-h-screen pt-28 pb-10">
        <div className="mx-auto w-full max-w-5xl px-4">
          <section className="home-panel rounded-3xl p-6 sm:p-8">
            <AdminTopbar
              title="Content Dashboard"
              subtitle="Admin Module"
              backHref="/"
              backLabel="Back to Site"
              showSignOut
            />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((item) => (
                <Link key={item.href} href={item.href} className="home-card rounded-2xl p-4 transition hover:border-accent/50">
                  <h2 className="text-base font-black text-primary dark:text-white">{item.label}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
