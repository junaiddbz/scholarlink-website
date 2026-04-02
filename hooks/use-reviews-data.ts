"use client";

import { useEffect, useMemo, useState } from "react";
import { REVIEWS, type ReviewItem } from "@/lib/reviews";

interface ApiResponse<T> {
  data: T;
}

export function useReviewsData() {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS.filter((item) => item.isPublished));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/reviews");
        const json = (await response.json()) as ApiResponse<ReviewItem[]>;

        if (!isMounted) {
          return;
        }

        if (Array.isArray(json.data)) {
          setReviews(json.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load reviews.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredReviews = useMemo(() => {
    const featured = reviews.filter((item) => item.isFeatured);
    return featured.length ? featured : reviews;
  }, [reviews]);

  return { reviews, featuredReviews, loading, error };
}
