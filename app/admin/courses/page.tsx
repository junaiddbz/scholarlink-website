"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminFetch } from "@/lib/admin-client";
import { CourseCard } from "@/components/course-card";
import { CourseModal } from "@/components/course-modal";
import type { Course, CourseCategory, CourseCategoryMeta, CourseIconKey } from "@/lib/courses";

type CourseItem = Course;

const EMPTY_FORM: CourseItem = {
  id: "",
  title: "",
  description: "",
  level: "",
  category: "academic",
  subcategory: "",
  icon: "book",
  link: "",
  duration: "",
  prerequisites: "",
  isArchived: false,
};

const ICON_OPTIONS: CourseIconKey[] = [
  "book",
  "brain",
  "graduation",
  "code",
  "laptop",
  "bot",
  "chart",
  "video",
  "image",
  "calculator",
  "flask",
  "atom",
  "dna",
  "languages",
  "landmark",
];

export default function AdminCoursesPage() {
  const [items, setItems] = useState<CourseItem[]>([]);
  const [categories, setCategories] = useState<CourseCategoryMeta[]>([]);
  const [form, setForm] = useState<CourseItem>(EMPTY_FORM);
  const [contactNumber, setContactNumber] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewModalCourse, setPreviewModalCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const response = await fetch("/api/courses?includeArchived=1", { cache: "no-store" });
    const json = (await response.json()) as { data: CourseItem[] };
    setItems(json.data ?? []);

    const categoriesResponse = await fetch("/api/categories?includeArchived=1", {
      cache: "no-store",
    });
    const categoriesJson = (await categoriesResponse.json()) as { data: CourseCategoryMeta[] };
    setCategories(categoriesJson.data ?? []);
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
      duration: item.duration ?? "",
      prerequisites: item.prerequisites ?? "",
      isArchived: item.isArchived ?? false,
    });
    const parsedNumber = (item.link.match(/wa\.me\/(\d+)/)?.[1] ?? "").trim();
    setContactNumber(parsedNumber);
  };

  const resetForm = () => {
    setSelectedId("");
    setShowPreview(false);
    setPreviewModalCourse(null);
    setForm(EMPTY_FORM);
    setContactNumber("");
    setError("");
    setSuccess("");
  };

  const buildWhatsappLink = (number: string) => {
    const digits = number.replace(/\D/g, "");
    return `https://wa.me/${digits}?text=Hello%20Scholarlink,%20I%20am%20interested%20in%20this%20course.`;
  };

  const commitSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload: Partial<CourseItem> = {
        ...(selectedId ? { id: selectedId } : {}),
        title: form.title.trim(),
        description: form.description.trim(),
        level: form.level.trim(),
        category: form.category,
        subcategory: form.subcategory.trim(),
        icon: form.icon,
        link: buildWhatsappLink(contactNumber),
        duration: form.duration?.trim() || undefined,
        prerequisites: form.prerequisites?.trim() || undefined,
      };

      await adminFetch<{ ok: boolean; id?: string }>("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await load();
      setShowPreview(false);
      setPreviewModalCourse(null);
      setSuccess("Course saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upsert course.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this course permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await adminFetch<{ ok: boolean }>("/api/admin/courses", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
      if (selectedId === id) {
        resetForm();
      }
      setSuccess("Course deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course.");
    }
  };

  const categoryOptions: CourseCategory[] = categories
    .map((item) => item.id)
    .filter((value, index, array) => array.indexOf(value) === index);

  const isFormValid =
    Boolean(form.title.trim()) &&
    Boolean(form.description.trim()) &&
    Boolean(form.level.trim()) &&
    Boolean(form.category) &&
    Boolean(form.subcategory.trim()) &&
    Boolean(form.icon) &&
    Boolean(contactNumber.replace(/\D/g, ""));

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
              title="Manage Courses"
              subtitle="Admin Module"
              backHref="/admin"
              backLabel="Back to Dashboard"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-white/70 p-3 dark:border-white/15 dark:bg-slate-900/35">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Available Courses: {items.length}</p>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  onClick={resetForm}
                >
                  New Course
                </button>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current Courses</p>
                <ul className="max-h-80 space-y-1 overflow-y-auto text-sm text-slate-700 dark:text-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                      <div>
                        <p>
                          <span className="font-semibold">{item.id}</span> - {item.title} ({item.category})
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
                  {selectedId ? "Edit Course" : "Create Course"}
                </p>
                <div className="space-y-3">
                <input
                  className="form-field w-full"
                  placeholder="Course title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  className="form-field min-h-[96px] w-full"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Level"
                    value={form.level}
                    onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Subcategory"
                    value={form.subcategory}
                    onChange={(e) => setForm((prev) => ({ ...prev, subcategory: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    className="form-field w-full"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-field w-full"
                    value={form.icon}
                    onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value as CourseIconKey }))}
                  >
                    {ICON_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="form-field w-full"
                  placeholder="Contact number (example: 923310207775)"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Duration (optional)"
                    value={form.duration ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Prerequisites (optional)"
                    value={form.prerequisites ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, prerequisites: e.target.value }))}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
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
                    Live Preview (Grid + Modal)
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <CourseCard
                      course={{
                        ...form,
                        id: selectedId || "preview-course",
                        link: buildWhatsappLink(contactNumber),
                      }}
                      badgeClassName={
                        categories.find((category) => category.id === form.category)?.badgeClassName ??
                        "bg-gray-100 text-gray-700"
                      }
                      onViewDetails={(course) => setPreviewModalCourse(course)}
                    />
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
                      onClick={() => {
                        setShowPreview(false);
                        setPreviewModalCourse(null);
                      }}
                    >
                      Back to Edit
                    </button>
                  </div>

                  <CourseModal course={previewModalCourse} onClose={() => setPreviewModalCourse(null)} />
                </div>
              ) : null}
              </div>
            </div>

            {error ? <p className="mt-4 text-sm font-semibold text-red-600 dark:text-red-400">{error}</p> : null}
            {success ? <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{success}</p> : null}
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
