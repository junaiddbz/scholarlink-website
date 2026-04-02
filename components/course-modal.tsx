"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Layers, ShieldAlert, X } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/lib/courses";

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export function CourseModal({ course, onClose }: CourseModalProps) {
  const applicationHref = course
    ? `/admissions?source=course-modal&courseId=${encodeURIComponent(course.id)}&courseTitle=${encodeURIComponent(course.title)}&category=${encodeURIComponent(course.category)}#apply-now`
    : "/admissions#apply-now";

  useEffect(() => {
    const isOpen = Boolean(course);
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevDocOverflow = document.documentElement.style.overflow;

    document.body.classList.toggle("course-modal-open", isOpen);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.documentElement.style.overflow = "hidden";
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
      window.dispatchEvent(new CustomEvent("course-modal-state", { detail: { open: false } }));
    };
  }, [course]);

  return (
    <AnimatePresence>
      {course ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-0 backdrop-blur-0 sm:items-center sm:p-6 sm:backdrop-blur-sm lg:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-panel w-full max-h-[92vh] max-w-2xl overflow-y-auto rounded-t-[1.5rem] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:max-h-[90vh] sm:rounded-[1.75rem] sm:pb-0"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.8 }}
            style={{ willChange: "transform, opacity" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-primary/10 bg-white/92 p-4 backdrop-blur-0 dark:border-white/10 dark:bg-slate-900/90 sm:static sm:bg-transparent sm:p-7 sm:backdrop-blur-0">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-accent mb-2">
                  {course.subcategory}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-primary dark:text-white leading-tight">
                  {course.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-slate-600 hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close details modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 p-4 sm:space-y-5 sm:p-7">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {course.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="surface-soft rounded-xl p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary dark:border dark:border-white/20 dark:bg-[#1b446f] dark:text-amber-200">
                      <Layers className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Level
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary dark:text-white">{course.level}</p>
                </div>
                <div className="surface-soft rounded-xl p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary dark:border dark:border-white/20 dark:bg-[#1b446f] dark:text-amber-200">
                      <Clock3 className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Duration
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {course.duration ?? "Ongoing support"}
                  </p>
                </div>
              </div>

              {course.prerequisites ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                      <ShieldAlert className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                      Prerequisites
                    </p>
                  </div>
                  <p className="text-sm text-amber-900 dark:text-amber-100">{course.prerequisites}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                <Link
                  href={applicationHref}
                  className="block min-h-[48px] w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-primary transition-colors hover:bg-accent-light"
                >
                  Start Application
                </Link>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-h-[48px] w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary-light"
                >
                  Inquire on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
