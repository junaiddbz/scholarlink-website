"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { useAnnouncementsData } from "@/hooks/use-announcements-data";
import type { AnnouncementItem } from "@/lib/announcements";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function formatDateLabel(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function buildMetaLabel(item: AnnouncementItem) {
  const publishLabel = formatDateLabel(item.publishAt);
  const expiryLabel = formatDateLabel(item.expiresAt);

  if (publishLabel && expiryLabel) {
    return `Live ${publishLabel} - ${expiryLabel}`;
  }

  if (expiryLabel) {
    return `Expires ${expiryLabel}`;
  }

  if (publishLabel) {
    return `Published ${publishLabel}`;
  }

  return "Current update";
}

export function AnnouncementRail() {
  const { rotatingAnnouncements } = useAnnouncementsData();
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = useMemo(() => rotatingAnnouncements.slice(0, 3), [rotatingAnnouncements]);
  const activeItem = items[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex < items.length) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (items.length < 2 || isPaused || shouldReduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 7000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, items.length, shouldReduceMotion]);

  if (!activeItem) {
    return null;
  }

  const onMouseEnter = () => setIsPaused(true);
  const onMouseLeave = () => setIsPaused(false);
  const onFocusCapture = () => setIsPaused(true);
  const onBlurCapture = (event: React.FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(nextTarget)) {
      setIsPaused(false);
    }
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <section id="announcements" className="mb-12 scroll-mt-28 lg:mb-14">
      <motion.div
        className="home-panel rounded-[2.1rem] p-5 sm:p-7"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Announcements</p>
            <h3 className="mt-2 text-2xl font-black text-primary dark:text-white sm:text-3xl">Latest Updates</h3>
          </div>

          {items.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 text-primary transition hover:bg-primary hover:text-white dark:border-white/20 dark:text-slate-200"
                onClick={goPrev}
                aria-label="Show previous announcement"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 text-primary transition hover:bg-primary hover:text-white dark:border-white/20 dark:text-slate-200"
                onClick={goNext}
                aria-label="Show next announcement"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeItem.id}
              className="home-card rounded-[1.5rem] p-5 sm:p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24 }}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-dark dark:text-accent">
                  <Megaphone className="h-3.5 w-3.5" />
                  {activeItem.isPinned ? "Pinned Update" : "Announcement"}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {buildMetaLabel(activeItem)}
                </span>
              </div>

              <h4 className="text-xl font-black text-primary dark:text-white sm:text-2xl">
                {activeItem.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
                {activeItem.message}
              </p>

              {activeItem.ctaLabel && activeItem.ctaHref ? (
                <div className="mt-4">
                  {isExternalHref(activeItem.ctaHref) ? (
                    <a
                      href={activeItem.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white transition hover:bg-primary-light"
                    >
                      {activeItem.ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={activeItem.ctaHref}
                      className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white transition hover:bg-primary-light"
                    >
                      {activeItem.ctaLabel}
                    </Link>
                  )}
                </div>
              ) : null}
            </motion.article>
          </AnimatePresence>

          {items.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === activeIndex ? "w-7 bg-primary dark:bg-accent" : "w-2.5 bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={`Show announcement ${index + 1}`}
                  aria-pressed={index === activeIndex}
                />
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
