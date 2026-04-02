"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminFetch } from "@/lib/admin-client";
import { ReviewCard } from "@/components/review-card";
import { ReviewModal } from "@/components/review-modal";
import type { ReviewItem, ReviewMediaType, ReviewSource } from "@/lib/reviews";

const EMPTY_FORM: ReviewItem = {
  id: "",
  authorName: "",
  authorRole: "Parent",
  program: "",
  content: "",
  rating: 5,
  source: "manual",
  mediaType: "none",
  mediaUrl: null,
  isPublished: true,
  isFeatured: false,
};

export default function AdminReviewsPage() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [form, setForm] = useState<ReviewItem>(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewModalReview, setPreviewModalReview] = useState<ReviewItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const response = await fetch("/api/reviews?includeUnpublished=1", { cache: "no-store" });
    const json = (await response.json()) as { data: ReviewItem[] };
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

    setForm(item);
  };

  const resetForm = () => {
    setSelectedId("");
    setShowPreview(false);
    setPreviewModalReview(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  };

  const commitSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload: Partial<ReviewItem> = {
        ...(selectedId ? { id: selectedId } : {}),
        authorName: form.authorName.trim(),
        authorRole: form.authorRole.trim(),
        program: form.program.trim(),
        content: form.content.trim(),
        rating: form.rating,
        source: form.source,
        mediaType: form.mediaType,
        mediaUrl: form.mediaUrl?.trim() || null,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
      };

      await adminFetch<{ ok: boolean; id?: string }>("/api/admin/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await load();
      setShowPreview(false);
      setPreviewModalReview(null);
      setSuccess("Review saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this review permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await adminFetch<{ ok: boolean }>("/api/admin/reviews", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
      if (selectedId === id) {
        resetForm();
      }
      setSuccess("Review deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review.");
    }
  };

  const isFormValid =
    Boolean(form.authorName.trim()) &&
    Boolean(form.authorRole.trim()) &&
    Boolean(form.program.trim()) &&
    Boolean(form.content.trim());

  const previewItem = useMemo<ReviewItem>(
    () => ({
      ...form,
      id: selectedId || "preview-review",
      authorName: form.authorName.trim() || "Anonymous",
      authorRole: form.authorRole.trim() || "Student",
      program: form.program.trim() || "Program",
      content: form.content.trim() || "Review content",
    }),
    [form, selectedId]
  );

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
              title="Manage Reviews"
              subtitle="Admin Module"
              backHref="/admin"
              backLabel="Back to Dashboard"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-white/70 p-3 dark:border-white/15 dark:bg-slate-900/35">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Available Reviews: {items.length}</p>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  onClick={resetForm}
                >
                  New Review
                </button>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current Reviews</p>
                <ul className="max-h-80 space-y-1 overflow-y-auto text-sm text-slate-700 dark:text-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                      <div>
                        <p>
                          <span className="font-semibold">{item.authorName}</span> - {item.program}
                        </p>
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
                  {selectedId ? "Edit Review" : "Create Review"}
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      className="form-field w-full"
                      placeholder="Author name"
                      value={form.authorName}
                      onChange={(event) => setForm((prev) => ({ ...prev, authorName: event.target.value }))}
                    />
                    <input
                      className="form-field w-full"
                      placeholder="Author role"
                      value={form.authorRole}
                      onChange={(event) => setForm((prev) => ({ ...prev, authorRole: event.target.value }))}
                    />
                  </div>

                  <input
                    className="form-field w-full"
                    placeholder="Program"
                    value={form.program}
                    onChange={(event) => setForm((prev) => ({ ...prev, program: event.target.value }))}
                  />

                  <textarea
                    className="form-field min-h-[110px] w-full"
                    placeholder="Review content"
                    value={form.content}
                    onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <select
                      className="form-field w-full"
                      value={form.rating}
                      onChange={(event) => setForm((prev) => ({ ...prev, rating: Number(event.target.value) as ReviewItem["rating"] }))}
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>{rating} Star</option>
                      ))}
                    </select>
                    <select
                      className="form-field w-full"
                      value={form.source}
                      onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value as ReviewSource }))}
                    >
                      <option value="manual">Manual</option>
                      <option value="google">Google</option>
                    </select>
                    <select
                      className="form-field w-full"
                      value={form.mediaType}
                      onChange={(event) => setForm((prev) => ({ ...prev, mediaType: event.target.value as ReviewMediaType }))}
                    >
                      <option value="none">No Media</option>
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <input
                    className="form-field w-full"
                    placeholder="Media URL (optional, photo/video/YouTube, e.g. https://youtu.be/M7lc1UVf-VE)"
                    value={form.mediaUrl ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, mediaUrl: event.target.value }))}
                  />

                  <div className="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-200">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.checked }))}
                      />
                      Published
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
                      />
                      Featured
                    </label>
                  </div>

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
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Live Preview (Grid + Modal)</p>
                  <ReviewCard review={previewItem} onReadMore={setPreviewModalReview} />

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
                      onClick={() => {
                        setShowPreview(false);
                        setPreviewModalReview(null);
                      }}
                    >
                      Back to Edit
                    </button>
                  </div>

                  <ReviewModal review={previewModalReview} onClose={() => setPreviewModalReview(null)} />
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
