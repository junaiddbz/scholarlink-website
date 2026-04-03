"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Star, X } from "lucide-react";
import type { ReviewItem } from "@/lib/reviews";

interface ReviewModalProps {
  review: ReviewItem | null;
  onClose: () => void;
}

function getSafeMediaUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function getYouTubeVideoId(value: string) {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    let candidate: string | null = null;

    if (host === "youtu.be") {
      candidate = parsed.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        candidate = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        candidate = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
      } else if (parsed.pathname.startsWith("/shorts/")) {
        candidate = parsed.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }

    if (!candidate) {
      return null;
    }

    const normalized = candidate.trim();
    return /^[A-Za-z0-9_-]{11}$/.test(normalized) ? normalized : null;
  } catch {
    return null;
  }
}

export function ReviewModal({ review, onClose }: ReviewModalProps) {
  const mediaUrl = getSafeMediaUrl(review?.mediaUrl);
  const hasMedia = Boolean(review && mediaUrl && review.mediaType !== "none");
  const youtubeVideoId =
    review?.mediaType === "video" && mediaUrl ? getYouTubeVideoId(mediaUrl) : null;
  const youtubeEmbedUrl = youtubeVideoId
    ? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}`
    : null;

  useEffect(() => {
    const isOpen = Boolean(review);
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
  }, [review, onClose]);

  return (
    <AnimatePresence>
      {review ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-0 backdrop-blur-0 sm:items-center sm:p-6 sm:backdrop-blur-sm lg:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
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
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-accent">Student Feedback</p>
                <h3 className="text-xl font-black text-primary dark:text-white sm:text-2xl">{review.authorName}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{review.authorRole}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-slate-600 hover:bg-slate-100 dark:border-white/20 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close review modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-7 sm:pb-7">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${review.id}-modal-star-${index}`}
                    className="h-5 w-5"
                    fill={index < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="rounded-xl border border-primary/10 bg-white/70 p-4 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
                {review.content}
              </p>

              {hasMedia ? (
                <div className="overflow-hidden rounded-xl border border-primary/15 bg-slate-50/80 dark:border-white/10 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between border-b border-primary/10 px-4 py-2 dark:border-white/10">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {review.mediaType === "video"
                        ? youtubeEmbedUrl
                          ? "YouTube Testimonial"
                          : "Video Testimonial"
                        : "Photo Testimonial"}
                    </p>
                    <a
                      href={mediaUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-light dark:text-accent"
                    >
                      Open Media <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {review.mediaType === "video" && youtubeEmbedUrl ? (
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        src={youtubeEmbedUrl}
                        title={`Video testimonial by ${review.authorName}`}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : review.mediaType === "video" ? (
                    <video
                      controls
                      preload="metadata"
                      className="max-h-[22rem] w-full bg-black"
                    >
                      <source src={mediaUrl ?? undefined} />
                      Your browser does not support embedded video playback.
                    </video>
                  ) : (
                    <img
                      src={mediaUrl ?? undefined}
                      alt={`Review media shared by ${review.authorName}`}
                      loading="lazy"
                      className="max-h-[26rem] w-full object-cover"
                    />
                  )}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Program</p>
                  <p className="text-sm font-semibold text-primary dark:text-white">{review.program}</p>
                </div>
                <div className="surface-soft rounded-xl p-4">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Source</p>
                  <p className="text-sm font-semibold text-primary dark:text-white">{review.source === "google" ? "Google Review" : "Verified Testimonial"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
