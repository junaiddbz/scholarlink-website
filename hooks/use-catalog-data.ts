"use client";

import { useEffect, useState } from "react";
import {
  COURSE_CATEGORIES,
  COURSES,
  type Course,
  type CourseCategoryMeta,
} from "@/lib/courses";

interface ApiResponse<T> {
  data: T;
}

const canonicalCategoryIds = COURSE_CATEGORIES.map((item) => item.id);

const canonicalCategoryAliases: Record<string, string[]> = {
  academic: ["academic", "tutoring"],
  language: ["language", "ielts", "english", "arabic", "urdu"],
  quran: ["quran", "quraan", "nazra", "hifz", "tafseer"],
  computer: ["computer", "it", "programming", "automation", "machine-learning", "ai"],
  media: ["media", "video", "photo", "editing", "graphic", "design", "marketing"],
};

function normalizeToken(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveCanonicalCategoryId(rawId?: string | null, rawTitle?: string | null) {
  const idToken = normalizeToken(rawId);
  const titleToken = normalizeToken(rawTitle);

  if (canonicalCategoryIds.includes(idToken)) {
    return idToken;
  }

  for (const canonicalId of canonicalCategoryIds) {
    const aliases = canonicalCategoryAliases[canonicalId] ?? [canonicalId];
    const matched = aliases.some(
      (alias) => idToken.includes(alias) || titleToken.includes(alias)
    );

    if (matched) {
      return canonicalId;
    }
  }

  return null;
}

function normalizeFetchedCategories(items: CourseCategoryMeta[]) {
  const consumedCanonicalIds = new Set<string>();
  const rawToNormalizedId = new Map<string, string>();

  const normalized = items.map((item) => {
    const canonicalId = resolveCanonicalCategoryId(item.id, item.title);
    const normalizedId =
      canonicalId && !consumedCanonicalIds.has(canonicalId) ? canonicalId : item.id;

    if (canonicalId && normalizedId === canonicalId) {
      consumedCanonicalIds.add(canonicalId);
    }

    rawToNormalizedId.set(item.id, normalizedId);

    return {
      ...item,
      id: normalizedId,
    };
  });

  return {
    categories: normalized,
    rawToNormalizedId,
  };
}

function normalizeFetchedCourses(items: Course[], rawToNormalizedId: Map<string, string>) {
  return items.map((item) => {
    const mappedFromCategoryLookup = rawToNormalizedId.get(item.category);
    const mappedCanonical = resolveCanonicalCategoryId(item.category, item.category);

    return {
      ...item,
      category: mappedFromCategoryLookup ?? mappedCanonical ?? item.category,
    };
  });
}

const categoryOrderById = new Map(COURSE_CATEGORIES.map((item, index) => [normalizeToken(item.id), index]));
const categoryOrderByTitle = new Map(COURSE_CATEGORIES.map((item, index) => [normalizeToken(item.title), index]));

const courseOrderById = new Map(COURSES.map((item, index) => [normalizeToken(item.id), index]));
const courseOrderByTitle = new Map(COURSES.map((item, index) => [normalizeToken(item.title), index]));

function rankCategory(item: CourseCategoryMeta) {
  const idRank = categoryOrderById.get(normalizeToken(item.id));
  if (typeof idRank === "number") {
    return idRank;
  }

  const titleRank = categoryOrderByTitle.get(normalizeToken(item.title));
  if (typeof titleRank === "number") {
    return titleRank;
  }

  return Number.MAX_SAFE_INTEGER;
}

function rankCourse(item: Course) {
  const idRank = courseOrderById.get(normalizeToken(item.id));
  if (typeof idRank === "number") {
    return idRank;
  }

  const titleRank = courseOrderByTitle.get(normalizeToken(item.title));
  if (typeof titleRank === "number") {
    return titleRank;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortCategoriesForDisplay(items: CourseCategoryMeta[]) {
  return [...items].sort((a, b) => {
    const rankDiff = rankCategory(a) - rankCategory(b);
    if (rankDiff !== 0) {
      return rankDiff;
    }

    const titleDiff = a.title.localeCompare(b.title);
    if (titleDiff !== 0) {
      return titleDiff;
    }

    return a.id.localeCompare(b.id);
  });
}

function sortCoursesForDisplay(items: Course[]) {
  return [...items].sort((a, b) => {
    const rankDiff = rankCourse(a) - rankCourse(b);
    if (rankDiff !== 0) {
      return rankDiff;
    }

    const categoryRankDiff = rankCategory({ id: a.category, title: a.category, description: "", badgeClassName: "" }) -
      rankCategory({ id: b.category, title: b.category, description: "", badgeClassName: "" });
    if (categoryRankDiff !== 0) {
      return categoryRankDiff;
    }

    const titleDiff = a.title.localeCompare(b.title);
    if (titleDiff !== 0) {
      return titleDiff;
    }

    return a.id.localeCompare(b.id);
  });
}

export function useCatalogData() {
  const [categories, setCategories] = useState<CourseCategoryMeta[]>(
    sortCategoriesForDisplay(COURSE_CATEGORIES)
  );
  const [courses, setCourses] = useState<Course[]>(sortCoursesForDisplay(COURSES));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const [categoriesResponse, coursesResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/courses"),
        ]);

        const categoriesJson = (await categoriesResponse.json()) as ApiResponse<CourseCategoryMeta[]>;
        const coursesJson = (await coursesResponse.json()) as ApiResponse<Course[]>;

        if (!isMounted) {
          return;
        }

        if (Array.isArray(categoriesJson.data)) {
          const normalizedCategories = normalizeFetchedCategories(categoriesJson.data);
          const sortedCategories = sortCategoriesForDisplay(normalizedCategories.categories);
          setCategories(sortedCategories);

          if (Array.isArray(coursesJson.data)) {
            const normalizedCourses = normalizeFetchedCourses(
              coursesJson.data,
              normalizedCategories.rawToNormalizedId
            );
            setCourses(sortCoursesForDisplay(normalizedCourses));
          }
          return;
        }

        if (Array.isArray(coursesJson.data)) {
          setCourses(sortCoursesForDisplay(coursesJson.data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load catalog data.");
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

  return { categories, courses, loading, error };
}
