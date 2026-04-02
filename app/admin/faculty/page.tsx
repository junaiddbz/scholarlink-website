"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { adminFetch } from "@/lib/admin-client";
import { FacultyModal } from "@/components/faculty-modal";
import type {
  FacultyContactPreference,
  FacultyGender,
  FacultyGroup,
  FacultyMember,
  FacultyTeachingMode,
} from "@/lib/faculty";
import { getFacultyDegree, getFacultyImage, getFacultyName, getFacultyRole } from "@/lib/faculty";

type FacultyItem = FacultyMember;

const EMPTY_FORM: FacultyItem = {
  id: "",
  name: "",
  role: "",
  degree: "",
  gender: "female",
  image: null,
  phone: "",
  email: null,
  bio: "",
  expertise: [],
  experienceYears: null,
  languages: [],
  teachingMode: "Online",
  availability: "",
  contactPreference: "admin-desk",
  link: "",
  group: "general-faculty",
  isArchived: false,
};

const GROUP_OPTIONS: FacultyGroup[] = ["academy-head", "general-faculty"];
const GENDER_OPTIONS: FacultyGender[] = ["female", "male"];
const MODE_OPTIONS: FacultyTeachingMode[] = ["Online", "Hybrid", "In-person"];
const CONTACT_OPTIONS: FacultyContactPreference[] = ["admin-desk", "whatsapp", "email"];

export default function AdminFacultyPage() {
  const [items, setItems] = useState<FacultyItem[]>([]);
  const [form, setForm] = useState<FacultyItem>(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewModalFaculty, setPreviewModalFaculty] = useState<FacultyMember | null>(null);
  const [expertiseText, setExpertiseText] = useState("");
  const [languagesText, setLanguagesText] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    const response = await fetch("/api/faculty?includeArchived=1", { cache: "no-store" });
    const json = (await response.json()) as { data: FacultyItem[] };
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
      name: item.name ?? "",
      role: item.role ?? "",
      degree: item.degree ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
      bio: item.bio ?? "",
      availability: item.availability ?? "",
      teachingMode: item.teachingMode ?? "Online",
      contactPreference: item.contactPreference ?? "admin-desk",
      isArchived: item.isArchived ?? false,
    });
    setExpertiseText((item.expertise ?? []).join(", "));
    setLanguagesText((item.languages ?? []).join(", "));
    setExperienceText(item.experienceYears ? String(item.experienceYears) : "");
  };

  const resetForm = () => {
    setSelectedId("");
    setShowPreview(false);
    setPreviewModalFaculty(null);
    setForm(EMPTY_FORM);
    setExpertiseText("");
    setLanguagesText("");
    setExperienceText("");
    setError("");
    setSuccess("");
  };

  const commitSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    const parsedExpertise = expertiseText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const parsedLanguages = languagesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const parsedExperience = experienceText.trim() ? Number(experienceText.trim()) : null;

    if (experienceText.trim() && Number.isNaN(parsedExperience)) {
      setSaving(false);
      setError("Experience must be a valid number.");
      return;
    }

    try {
      const payload: Partial<FacultyItem> = {
        ...(selectedId ? { id: selectedId } : {}),
        name: form.name?.trim() || null,
        role: form.role?.trim() || null,
        degree: form.degree?.trim() || null,
        gender: form.gender,
        image: form.image?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        bio: form.bio?.trim() || null,
        expertise: parsedExpertise.length ? parsedExpertise : null,
        experienceYears: parsedExperience,
        languages: parsedLanguages.length ? parsedLanguages : null,
        teachingMode: form.teachingMode,
        availability: form.availability?.trim() || null,
        contactPreference: form.contactPreference,
        link: form.link.trim(),
        group: form.group,
      };

      await adminFetch<{ ok: boolean; id?: string }>("/api/admin/faculty", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await load();
      setShowPreview(false);
      setPreviewModalFaculty(null);
      setSuccess("Faculty profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upsert faculty.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm("Delete this faculty profile permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    try {
      await adminFetch<{ ok: boolean }>("/api/admin/faculty", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      await load();
      if (selectedId === id) {
        resetForm();
      }
      setSuccess("Faculty deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete faculty.");
    }
  };

  const isFormValid = Boolean(form.group) && Boolean(form.gender) && Boolean(form.link.trim());

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
              title="Manage Faculty"
              subtitle="Admin Module"
              backHref="/admin"
              backLabel="Back to Dashboard"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-white/70 p-3 dark:border-white/15 dark:bg-slate-900/35">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Available Faculty: {items.length}</p>
                <button
                  type="button"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                  onClick={resetForm}
                >
                  New Faculty
                </button>
              </div>

              <div className="surface-soft rounded-xl p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current Faculty</p>
                <ul className="max-h-80 space-y-1 overflow-y-auto text-sm text-slate-700 dark:text-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                      <div>
                        <p>
                          <span className="font-semibold">{item.id}</span> - {item.name ?? "Unnamed"} ({item.group})
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
                  {selectedId ? "Edit Faculty" : "Create Faculty"}
                </p>
                <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Name"
                    value={form.name ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Role"
                    value={form.role ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <input
                  className="form-field w-full"
                  placeholder="Degree"
                  value={form.degree ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    className="form-field w-full"
                    value={form.group}
                    onChange={(e) => setForm((prev) => ({ ...prev, group: e.target.value as FacultyGroup }))}
                  >
                    {GROUP_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-field w-full"
                    value={form.gender}
                    onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value as FacultyGender }))}
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Phone"
                    value={form.phone ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Email"
                    value={form.email ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <textarea
                  className="form-field min-h-[88px] w-full"
                  placeholder="Bio"
                  value={form.bio ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Expertise (comma-separated)"
                    value={expertiseText}
                    onChange={(e) => setExpertiseText(e.target.value)}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Languages (comma-separated)"
                    value={languagesText}
                    onChange={(e) => setLanguagesText(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="form-field w-full"
                    placeholder="Experience Years"
                    value={experienceText}
                    onChange={(e) => setExperienceText(e.target.value)}
                  />
                  <input
                    className="form-field w-full"
                    placeholder="Availability"
                    value={form.availability ?? ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    className="form-field w-full"
                    value={form.teachingMode ?? "Online"}
                    onChange={(e) => setForm((prev) => ({ ...prev, teachingMode: e.target.value as FacultyTeachingMode }))}
                  >
                    {MODE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-field w-full"
                    value={form.contactPreference ?? "admin-desk"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contactPreference: e.target.value as FacultyContactPreference,
                      }))
                    }
                  >
                    {CONTACT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="form-field w-full"
                  placeholder="WhatsApp link"
                  value={form.link}
                  onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                />
                <input
                  className="form-field w-full"
                  placeholder="Image URL (optional)"
                  value={form.image ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                />

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
                    <article className="home-card group rounded-[1.75rem] p-5 text-center transition-all duration-300 hover:shadow-[0_20px_50px_-28px_rgba(3,44,96,0.72)] dark:border-white/12 dark:bg-gradient-to-br dark:from-[#102f52]/94 dark:via-[#13365d]/92 dark:to-[#0f2f50]/94">
                      <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full ring-4 ring-white shadow-lg transition-all duration-300 group-hover:ring-accent/30 dark:ring-gray-700">
                        <Image
                          src={getFacultyImage({
                            ...form,
                            id: selectedId || "preview-faculty",
                          })}
                          alt={getFacultyName({
                            ...form,
                            id: selectedId || "preview-faculty",
                          })}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <h3 className="text-base font-bold leading-tight text-primary dark:text-white">
                        {getFacultyName({
                          ...form,
                          id: selectedId || "preview-faculty",
                        })}
                      </h3>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                        {getFacultyRole({
                          ...form,
                          id: selectedId || "preview-faculty",
                        })}
                      </p>
                      <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {getFacultyDegree({
                          ...form,
                          id: selectedId || "preview-faculty",
                        })}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModalFaculty({
                            ...form,
                            id: selectedId || "preview-faculty",
                          })
                        }
                        className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-light dark:bg-accent dark:text-primary dark:hover:bg-accent-light"
                      >
                        View Profile
                      </button>
                    </article>
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
                        setPreviewModalFaculty(null);
                      }}
                    >
                      Back to Edit
                    </button>
                  </div>

                  <FacultyModal faculty={previewModalFaculty} onClose={() => setPreviewModalFaculty(null)} />
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
