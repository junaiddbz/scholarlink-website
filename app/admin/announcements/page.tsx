"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminFetch } from "@/lib/admin-client";
import {
  ANNOUNCEMENT_CTA_OPTIONS,
  isAnnouncementActive,
  parseAnnouncementTime,
  type AnnouncementItem,
} from "@/lib/announcements";

type AnnouncementForm = {
  title: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
  priority: AnnouncementItem["priority"];
  isPublished: boolean;
  isPinned: boolean;
  publishAt: string;
  expiresAt: string;
};

const EMPTY_FORM: AnnouncementForm = {
  title: "",
  message: "",
  ctaLabel: "",
  ctaHref: "",
  priority: 3,
  isPublished: true,
  isPinned: false,
  publishAt: "",
  expiresAt: "",
};

function toInputDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const tzOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function formFromItem(item: AnnouncementItem): AnnouncementForm {
  return {
    title: item.title,
    message: item.message,
    ctaLabel: item.ctaLabel ?? "",
    ctaHref: item.ctaHref ?? "",
    priority: item.priority,
    isPublished: item.isPublished,
    isPinned: item.isPinned,
    publishAt: toInputDateTime(item.publishAt),
    expiresAt: toInputDateTime(item.expiresAt),
  };
}

function getAnnouncementStatus(item: AnnouncementItem) {
  const nowMs = Date.now();

  if (!item.isPublished) {
    return "Draft";
  }

  const publishAtMs = parseAnnouncementTime(item.publishAt);
  if (publishAtMs !== null && publishAtMs > nowMs) {
    return "Scheduled";
  }

  return isAnnouncementActive(item, nowMs) ? "Live" : "Expired";
}

function validateForm(form: AnnouncementForm) {
  if (!form.title.trim() || !form.message.trim()) {
    return "Title and message are required.";
  }

  const ctaLabel = form.ctaLabel.trim();
  const ctaHref = form.ctaHref.trim();
  if (Boolean(ctaLabel) !== Boolean(ctaHref)) {
    return "CTA label and CTA URL must be provided together.";
  }

  const publishAt = toIsoDateTime(form.publishAt);
  const expiresAt = toIsoDateTime(form.expiresAt);

  if (form.publishAt && !publishAt) {
    return "Publish datetime is invalid.";
  }

  if (form.expiresAt && !expiresAt) {
    return "Expiry datetime is invalid.";
  }

  if (publishAt && expiresAt && Date.parse(expiresAt) <= Date.parse(publishAt)) {
    return "Expiry datetime must be after publish datetime.";
  }

  return "";
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ctaOptions = useMemo(() => {
    const currentHref = form.ctaHref.trim();
    if (!currentHref) {
      return ANNOUNCEMENT_CTA_OPTIONS;
    }

    const exists = ANNOUNCEMENT_CTA_OPTIONS.some((item) => item.href === currentHref);
    if (exists) {
      return ANNOUNCEMENT_CTA_OPTIONS;
    }

    return [
      {
        href: currentHref,
        label: `Current custom URL (${currentHref})`,
        recommendedCtaLabel: form.ctaLabel.trim() || "Visit Link",
      },
      ...ANNOUNCEMENT_CTA_OPTIONS,
    ];
  }, [form.ctaHref, form.ctaLabel]);

  const load = async () => {
    const json = await adminFetch<{ data: AnnouncementItem[] }>("/api/admin/announcements");
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

    setForm(formFromItem(item));
    setError("");
    setSuccess("");
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
      const payload: Partial<AnnouncementItem> = {
        ...(selectedId ? { id: selectedId } : {}),
        title: form.title.trim(),
        message: form.message.trim(),
        ctaLabel: form.ctaLabel.trim() || null,
        ctaHref: form.ctaHref.trim() || null,
        priority: form.priority,
        isPublished: form.isPublished,
        isPinned: form.isPinned,
        publishAt: toIsoDateTime(form.publishAt),
        expiresAt: toIsoDateTime(form.expiresAt),
      };

      await adminFetch<{ ok: boolean; id?: string }>("/api/admin/announcements", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await load();
      setShowPreview(false);
      setSuccess("Announcement saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this announcement permanently?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await adminFetch<{ ok: boolean }>("/api/admin/announcements", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      await load();
      if (selectedId === id) {
        resetForm();
      }
      setSuccess("Announcement deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete announcement.");
    }
  };

  const previewItem = useMemo<AnnouncementItem>(
    () => ({
      id: selectedId || "preview-announcement",
      title: form.title.trim() || "Announcement title",
      message: form.message.trim() || "Announcement message",
      ctaLabel: form.ctaLabel.trim() || null,
      ctaHref: form.ctaHref.trim() || null,
      priority: form.priority,
      isPublished: form.isPublished,
      isPinned: form.isPinned,
      publishAt: toIsoDateTime(form.publishAt),
      expiresAt: toIsoDateTime(form.expiresAt),
    }),
    [form, selectedId]
  );

  const openPreview = () => {
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
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
              title="Manage Announcements"
              subtitle="Admin Module"
              backHref="/admin"
              backLabel="Back to Dashboard"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-white/70 p-3 dark:border-white/15 dark:bg-slate-900/35">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Total Announcements: {items.length}
                </p>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  onClick={resetForm}
                >
                  New Announcement
                </button>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Current Announcements
                </p>
                <ul className="max-h-80 space-y-1 overflow-y-auto text-sm text-slate-700 dark:text-slate-200">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {getAnnouncementStatus(item)} · Priority {item.priority}
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
                  {selectedId ? "Edit Announcement" : "Create Announcement"}
                </p>
                <div className="space-y-3">
                  <input
                    className="form-field w-full"
                    placeholder="Announcement title"
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  />

                  <textarea
                    className="form-field min-h-[110px] w-full"
                    placeholder="Announcement message"
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      className="form-field w-full"
                      placeholder="CTA label (optional)"
                      value={form.ctaLabel}
                      onChange={(event) => setForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
                    />

                    <select
                      className="form-field w-full"
                      value={form.ctaHref}
                      onChange={(event) => {
                        const nextHref = event.target.value;
                        const selected = ctaOptions.find((item) => item.href === nextHref);

                        setForm((prev) => ({
                          ...prev,
                          ctaHref: nextHref,
                          ctaLabel:
                            nextHref && !prev.ctaLabel.trim()
                              ? selected?.recommendedCtaLabel ?? prev.ctaLabel
                              : prev.ctaLabel,
                        }));
                      }}
                    >
                      <option value="">CTA URL (optional) - Select a page</option>
                      {ctaOptions.map((option) => (
                        <option key={option.href} value={option.href}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <select
                      className="form-field w-full"
                      value={form.priority}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          priority: Number(event.target.value) as AnnouncementItem["priority"],
                        }))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          Priority {value}
                        </option>
                      ))}
                    </select>

                    <input
                      type="datetime-local"
                      className="form-field w-full"
                      value={form.publishAt}
                      onChange={(event) => setForm((prev) => ({ ...prev, publishAt: event.target.value }))}
                    />

                    <input
                      type="datetime-local"
                      className="form-field w-full"
                      value={form.expiresAt}
                      onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-slate-200">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isPublished}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, isPublished: event.target.checked }))
                        }
                      />
                      Published
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.isPinned}
                        onChange={(event) => setForm((prev) => ({ ...prev, isPinned: event.target.checked }))}
                      />
                      Pinned
                    </label>
                  </div>

                  <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white disabled:opacity-50"
                    onClick={openPreview}
                    disabled={saving}
                  >
                    {selectedId ? "Preview Update" : "Preview Create"}
                  </button>
                </div>
              </div>

              {showPreview ? (
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Live Preview
                  </p>

                  <article className="home-card rounded-[1.5rem] p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-dark dark:text-accent">
                        {previewItem.isPinned ? "Pinned Update" : "Announcement"}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Priority {previewItem.priority}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-primary dark:text-white">{previewItem.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {previewItem.message}
                    </p>

                    {previewItem.ctaLabel && previewItem.ctaHref ? (
                      <div className="mt-4 rounded-lg border border-primary/15 bg-white/70 p-3 text-xs dark:border-white/10 dark:bg-slate-900/45">
                        <p className="font-bold text-primary dark:text-white">CTA: {previewItem.ctaLabel}</p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">{previewItem.ctaHref}</p>
                      </div>
                    ) : null}
                  </article>

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
