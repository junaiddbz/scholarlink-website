"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import {
  type FacultyMember,
  getFacultyAvailability,
  getFacultyBio,
  getFacultyDegree,
  getFacultyExperience,
  getFacultyExpertise,
  getFacultyImage,
  getFacultyLanguages,
  getFacultyName,
  getFacultyRole,
} from "@/lib/faculty";

interface FacultyModalProps {
  faculty: FacultyMember | null;
  onClose: () => void;
}

export function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  const phone = faculty?.phone?.trim() ?? "";
  const email = faculty?.email?.trim() ?? "";
  const link = faculty?.link?.trim() ?? "";

  const hasPhone = Boolean(phone) && phone.toLowerCase() !== "inquire";
  const hasEmail = Boolean(email);
  const hasWhatsapp = /^https?:\/\/wa\.me\//i.test(link);
  const hasAnyContactDetails = hasPhone || hasEmail || hasWhatsapp;

  useEffect(() => {
    const isOpen = Boolean(faculty);
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevDocOverflow = document.documentElement.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.toggle("course-modal-open", isOpen);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overflow = prevDocOverflow;
    }

    window.dispatchEvent(new CustomEvent("course-modal-state", { detail: { open: isOpen } }));

    return () => {
      document.body.classList.remove("course-modal-open");
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overflow = prevDocOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.dispatchEvent(new CustomEvent("course-modal-state", { detail: { open: false } }));
    };
  }, [faculty, onClose]);

  return (
    <AnimatePresence>
      {faculty ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-0 backdrop-blur-0 sm:items-center sm:p-6 sm:backdrop-blur-sm lg:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="faculty-modal-title"
        >
          <motion.div
            className="modal-panel flex w-full max-h-[92vh] max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] sm:max-h-[90vh] sm:rounded-[1.75rem]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.8 }}
            style={{ willChange: "transform, opacity" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="z-10 flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 bg-white/92 p-4 dark:border-white/10 dark:bg-slate-900/90 sm:bg-transparent sm:p-7 sm:dark:bg-transparent">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-accent mb-2">
                  {faculty.group === "academy-head" ? "Academy Leadership" : "General Faculty"}
                </p>
                <h3 id="faculty-modal-title" className="text-xl sm:text-2xl font-black text-primary dark:text-white leading-tight">
                  {getFacultyName(faculty)}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {getFacultyRole(faculty)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-slate-600 hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close faculty profile modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-7 sm:pb-7">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden ring-4 ring-accent/30 shadow-lg">
                <Image
                  src={getFacultyImage(faculty)}
                  alt={getFacultyName(faculty)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 112px"
                />
              </div>

              <p className="text-center text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {getFacultyBio(faculty)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Qualification
                  </p>
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {getFacultyDegree(faculty)}
                  </p>
                </div>
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Experience
                  </p>
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {getFacultyExperience(faculty)}
                  </p>
                </div>
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Languages
                  </p>
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {getFacultyLanguages(faculty)}
                  </p>
                </div>
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Availability
                  </p>
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {getFacultyAvailability(faculty)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {getFacultyExpertise(faculty).map((item) => (
                    <span
                      key={item}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent-dark dark:text-accent"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {hasAnyContactDetails ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {hasPhone ? (
                    <div className="surface-soft rounded-xl p-4">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-primary dark:text-white">{phone}</p>
                    </div>
                  ) : null}

                  {hasEmail ? (
                    <div className="surface-soft rounded-xl p-4">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Email
                      </p>
                      <p className="break-all text-sm font-semibold text-primary dark:text-white">{email}</p>
                    </div>
                  ) : null}

                  {hasWhatsapp ? (
                    <div className="surface-soft rounded-xl p-4 sm:col-span-2">
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        WhatsApp
                      </p>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-light"
                      >
                        Contact on WhatsApp
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Contact Note
                  </p>
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Direct contact details are managed by admin and will be shown when available.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
