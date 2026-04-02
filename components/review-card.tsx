"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { ReviewItem } from "@/lib/reviews";

interface ReviewCardProps {
  review: ReviewItem;
  onReadMore?: (review: ReviewItem) => void;
}

export function ReviewCard({ review, onReadMore }: ReviewCardProps) {
  const hasMedia = Boolean(review.mediaUrl && review.mediaType !== "none");

  return (
    <motion.article
      className="home-card rounded-[1.5rem] p-5 sm:p-6"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={`${review.id}-star-${index}`}
              className="h-4 w-4"
              fill={index < review.rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-dark dark:text-accent">
          {review.program}
        </span>
      </div>

      <p className="line-clamp-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {review.content}
      </p>

      {hasMedia ? (
        <p className="mt-3 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary dark:bg-accent/15 dark:text-accent">
          {review.mediaType === "video" ? "Includes Video" : "Includes Photo"}
        </p>
      ) : null}

      <div className="mt-4 border-t border-primary/10 pt-3 dark:border-white/10">
        <p className="text-sm font-black text-primary dark:text-white">{review.authorName}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {review.authorRole}
        </p>
      </div>

      {onReadMore ? (
        <button
          type="button"
          onClick={() => onReadMore(review)}
          className="mt-4 inline-flex rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-light"
        >
          Read Full Review
        </button>
      ) : null}
    </motion.article>
  );
}
