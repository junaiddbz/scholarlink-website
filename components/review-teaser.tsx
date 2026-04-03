"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ReviewCard } from "@/components/review-card";
import { ReviewModal } from "@/components/review-modal";
import { useReviewsData } from "@/hooks/use-reviews-data";
import type { ReviewItem } from "@/lib/reviews";

export function ReviewTeaser() {
  const { featuredReviews, loading } = useReviewsData();
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  const teaserItems = useMemo(() => featuredReviews.slice(0, 3), [featuredReviews]);

  return (
    <section id="reviews" className="mb-8 scroll-mt-28 sm:mb-10 lg:mb-14">
      <motion.div
        className="home-panel rounded-[2.2rem] p-6 sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Social Proof</p>
            <h3 className="mt-2 text-3xl font-black text-primary dark:text-white">What Students And Parents Say</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Real feedback from our learning community across academics, Quran, language, and skills programs.
            </p>
          </div>
          <Link
            href="/reviews"
            className="rounded-xl border-2 border-primary px-5 py-2 text-xs font-black text-primary transition hover:bg-primary hover:text-white dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-primary"
          >
            View All Reviews
          </Link>
        </div>

        {loading ? <p className="mb-3 text-sm text-slate-500 dark:text-slate-300">Loading latest reviews...</p> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {teaserItems.map((review) => (
            <ReviewCard key={review.id} review={review} onReadMore={setSelectedReview} />
          ))}
        </div>
      </motion.div>

      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </section>
  );
}
