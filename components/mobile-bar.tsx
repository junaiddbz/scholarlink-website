"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, BookOpen, Send } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function MobileBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsRevealed(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsCompact(window.innerWidth < 380 || window.innerHeight < 700);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onCourseModalState = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>;
      setIsCourseModalOpen(Boolean(customEvent.detail?.open));
    };

    setIsCourseModalOpen(document.body.classList.contains("course-modal-open"));
    window.addEventListener("course-modal-state", onCourseModalState as EventListener);

    return () => window.removeEventListener("course-modal-state", onCourseModalState as EventListener);
  }, []);

  if (pathname === "/admissions") {
    return null;
  }

  const isCoursesPage = pathname === "/courses";
  const category = searchParams.get("category") || "academic";

  const categoryLabel =
    category === "quran"
      ? "Quran courses"
      : category === "computer"
      ? "Computer courses"
      : category === "media"
      ? "Media courses"
      : "Academic tutoring";

  const secondaryHref = isCoursesPage ? "/admissions#apply-now" : "/courses?category=academic";
  const secondaryLabel = isCoursesPage ? "Start Application" : "Courses";

  const whatsappText = encodeURIComponent(
    isCoursesPage
      ? `Hello Scholarlink, I am interested in ${categoryLabel}. Please guide me about enrollment and timings.`
      : "Hello Scholarlink, I want guidance about your programs and admissions."
  );

  return (
    <motion.div
      className="fixed left-3 right-3 z-40 lg:hidden"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      animate={{
        opacity: isRevealed && !isCourseModalOpen ? 1 : 0,
        y: isRevealed && !isCourseModalOpen ? 0 : 22,
        pointerEvents: isRevealed && !isCourseModalOpen ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/14 bg-gradient-to-r from-white/96 via-[#f4f8ff] to-[#edf4fc] p-1 shadow-[0_20px_48px_-34px_rgba(3,44,96,0.78)] backdrop-blur-xl dark:border-white/16 dark:bg-gradient-to-r dark:from-[#071a32]/96 dark:via-[#0c2545]/95 dark:to-[#0a213f]/96">
        <div
          className="pointer-events-none absolute -left-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-primary/12 blur-2xl dark:bg-accent/12"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-accent/18 blur-2xl dark:bg-primary/16"
          aria-hidden="true"
        />
        <div className="relative flex gap-2">
          <motion.a
            href={`https://wa.me/923310207775?text=${whatsappText}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-light px-2 py-3 text-xs font-black text-white transition hover:from-primary-light hover:to-[#0d4a97] sm:gap-2 sm:text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-300/35">
              <MessageCircle className="h-3.5 w-3.5" />
            </span>
            <span>{isCompact ? "Chat" : isCoursesPage ? "Chat For Enrollment" : "WhatsApp"}</span>
          </motion.a>

          <motion.div
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/18 bg-white/92 px-2 py-3 text-xs font-black text-primary transition hover:bg-white dark:border-white/20 dark:bg-slate-800/92 dark:text-slate-100 dark:hover:bg-slate-700/95 sm:gap-2 sm:text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <Link href={secondaryHref} className="flex h-full w-full items-center justify-center gap-2">
              {isCoursesPage ? <Send className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              <span>{isCompact ? (isCoursesPage ? "Apply" : "Courses") : secondaryLabel}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
