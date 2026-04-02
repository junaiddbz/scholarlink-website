"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminFetch } from "@/lib/admin-client";
import type { CourseCategoryMeta } from "@/lib/courses";
import { BookOpen, GraduationCap, Laptop, Video, Languages } from "lucide-react";

const CATEGORY_ICONS = {
  quran: BookOpen,
  computer: Laptop,
  media: Video,
  academic: GraduationCap,
  language: Languages,
} as const;

type CategoryItem = CourseCategoryMeta;

const DEFAULT_BADGE_CLASS =
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";

const EMPTY_FORM: CategoryItem = {
  id: "",
  title: "",
  description: "",
  badgeClassName: DEFAULT_BADGE_CLASS,
  isArchived: false,
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [form, setForm] = useState<CategoryItem>(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const response = await fetch("/api/categories?includeArchived=1", { cache: "no-store" });
    const json = (await response.json()) as { data: CategoryItem[] };
    setItems(json.data ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const loadForEdit = (id: string) => {
    setSelectedId(id);
    setShowPreview(false);
    const item = items.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    setForm({
      ...item,
      isArchived: item.isArchived ?? false,
    });
  };

  const resetForm = () => {
    setSelectedId("");
    setShowPreview(false);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  };

  const commitSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload: Partial<CategoryItem> = {
        ...(selectedId ? { id: selectedId } : {}),
        title: form.title.trim(),
        description: form.description.trim(),
        badgeClassName: DEFAULT_BADGE_CLASS,
      };

      await adminFetch<{ ok: boolean; id?: string }>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await load();
      setShowPreview(false);
      setSuccess("Category saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upsert category.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this category permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await adminFetch<{ ok: boolean }>("/api/admin/categories", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
      if (selectedId === id) {
        resetForm();
      }
      setSuccess("Category deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    }
  };

  const isFormValid =
    Boolean(form.title.trim()) &&
    Boolean(form.description.trim());

  const openPreview = () => {
    if (!isFormValid) {
      setError("Please complete required fields first.");
      return;
    }

    setError("");
    setSuccess("");
    setShowPreview(true);
  };

  return (
    <AdminGuard>
      <main className="min-h-screen pt-28 pb-10">
        <div className="mx-auto w-full max-w-6xl px-4">
          <section className="home-panel rounded-3xl p-6 sm:p-8">
            <AdminTopbar
              title="Manage Categories"
              subtitle="Admin Module"
              backHref="/admin"
              backLabel="Back to Dashboard"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-white/70 p-3 dark:border-white/15 dark:bg-slate-900/35">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Available Categories: {items.length}</p>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  onClick={resetForm}
                >
                  New Category
                </button>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current Categories</p>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                      <div>
                        <p className="font-semibold">
                          {item.id} - {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-bold text-primary"
                          onClick={() => loadForEdit(item.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-red-300 px-3 py-1 text-xs font-bold text-red-700 dark:border-red-500/50 dark:text-red-300"
                          onClick={() => removeItem(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {selectedId ? "Edit Category" : "Create Category"}
                </p>
                <div className="space-y-3">
                  <input
                    className="form-field w-full"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Category title"
                  />
                  <textarea
                    className="form-field min-h-[100px] w-full"
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Category description"
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white disabled:opacity-50"
                    onClick={openPreview}
                    disabled={!isFormValid || saving}
                  >
                    {selectedId ? "Preview Update" : "Preview Create"}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Live Preview (Exact Category Views)
                  </p>

                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">As Seen In Course Catalog</p>
                      <article className="home-card z-0 rounded-[2rem] p-6 sm:p-7">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          {(() => {
                            const Icon = CATEGORY_ICONS[(items.find((item) => item.id === selectedId)?.id ?? "academic") as keyof typeof CATEGORY_ICONS] ?? GraduationCap;
                            return (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gradient-to-br dark:from-primary/30 dark:to-accent/20 dark:text-accent">
                                <Icon className="h-6 w-6" />
                              </div>
                            );
                          })()}
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${DEFAULT_BADGE_CLASS}`}>
                            0 Courses
                          </span>
                        </div>
                        <h4 className="mb-2 text-2xl font-black text-primary dark:text-white">{form.title || "Untitled Category"}</h4>
                        <p className="mb-6 min-h-[42px] text-sm leading-relaxed text-slate-600 dark:text-slate-300">{form.description || "Category description..."}</p>
                        <span className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white">
                          Explore {form.title || "Category"}
                        </span>
                      </article>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/40">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">As Seen In Course Grid Tabs</p>
                      <button
                        type="button"
                        className="rounded-xl border border-accent bg-accent px-4 py-2.5 text-left text-sm font-bold text-primary shadow-sm dark:border-accent dark:bg-accent dark:text-primary"
                      >
                        <span className="block whitespace-nowrap">{form.title || "Untitled Category"}</span>
                        <span className="mt-0.5 block text-[10px] font-semibold text-primary/80">0 courses</span>
                      </button>
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Category does not have a dedicated modal on the live site. This preview shows all live category display styles.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white disabled:opacity-50"
                      onClick={commitSave}
                      disabled={saving}
                    >
                      {saving ? "Committing..." : "Confirm Commit"}
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                      onClick={() => setShowPreview(false)}
                    >
                      Back to Edit
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {error ? <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}
            {success ? <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{success}</p> : null}
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
