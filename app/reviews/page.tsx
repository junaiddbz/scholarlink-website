"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { MobileBar } from "@/components/mobile-bar";
import { ReviewCard } from "@/components/review-card";
import { ReviewModal } from "@/components/review-modal";
import { useReviewsData } from "@/hooks/use-reviews-data";
import type { ReviewItem } from "@/lib/reviews";

export default function ReviewsPage() {
  const { reviews, loading } = useReviewsData();
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)),
    [reviews]
  );

  return (
    <>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-accent shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="min-h-screen pb-28 pt-28 focus:outline-none lg:pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="page-breadcrumb mb-8 text-sm">
            <Link href="/" className="transition-colors hover:text-primary dark:hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-primary dark:text-white">Reviews</span>
          </div>

          <section className="home-panel mb-8 rounded-[2.4rem] p-7 sm:p-10">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Reviews</p>
            <h1 className="text-3xl font-black leading-tight text-primary dark:text-white sm:text-5xl">
              Trusted By Students And Parents
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Honest feedback from learners and families who studied with Scholarlink across academics, Quran, language, and digital skills programs.
            </p>
          </section>

          {loading ? <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Loading reviews...</p> : null}

          <section className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sortedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onReadMore={setSelectedReview} />
            ))}
          </section>

          <Footer />
        </div>
      </main>

      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />

      <BackToTop />
      <MobileBar />
    </>
  );
}
