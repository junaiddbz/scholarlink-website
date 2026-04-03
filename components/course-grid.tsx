"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { type Course, type CourseCategory } from "@/lib/courses";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/course-card";
import { CourseModal } from "@/components/course-modal";
import { useCatalogData } from "@/hooks/use-catalog-data";

function normalizeCategoryToken(value?: string | null) {
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

function matchesTokenWithAliases(titleToken: string, requestedToken: string) {
  if (!requestedToken) {
    return false;
  }

  if (titleToken.includes(requestedToken)) {
    return true;
  }

  if (requestedToken === "academic") {
    return titleToken.includes("academic") || titleToken.includes("tutoring");
  }

  if (requestedToken === "language") {
    return titleToken.includes("language") || titleToken.includes("ielts");
  }

  if (requestedToken === "quran") {
    return titleToken.includes("quran") || titleToken.includes("quraan");
  }

  if (requestedToken === "computer") {
    return titleToken.includes("computer") || titleToken.includes("programming") || titleToken.includes("it");
  }

  if (requestedToken === "media") {
    return (
      titleToken.includes("media") ||
      titleToken.includes("video") ||
      titleToken.includes("photo") ||
      titleToken.includes("design") ||
      titleToken.includes("editing")
    );
  }

  return false;
}

function resolveCategoryFromQuery(
  requestedCategory: string | null,
  categoryIds: Array<{ id: string; title: string }>,
  fallbackCategory: string
) {
  const requestedToken = normalizeCategoryToken(requestedCategory);
  if (!requestedToken) {
    return fallbackCategory;
  }

  const exactIdMatch = categoryIds.find(
    (category) => normalizeCategoryToken(category.id) === requestedToken
  );
  if (exactIdMatch) {
    return exactIdMatch.id;
  }

  const exactTitleMatch = categoryIds.find(
    (category) => normalizeCategoryToken(category.title) === requestedToken
  );
  if (exactTitleMatch) {
    return exactTitleMatch.id;
  }

  const aliasedMatch = categoryIds.find((category) =>
    matchesTokenWithAliases(normalizeCategoryToken(category.title), requestedToken)
  );

  return aliasedMatch?.id ?? fallbackCategory;
}

export function CourseGrid() {
  const { categories, courses, loading } = useCatalogData();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const fallbackCategory = (categories[0]?.id ?? "academic") as CourseCategory;
  const requestedCategoryToken = normalizeCategoryToken(requestedCategory);
  const validRequestedCategory = resolveCategoryFromQuery(
    requestedCategory,
    categories,
    fallbackCategory
  ) as CourseCategory;

  const [activeCategory, setActiveCategory] = useState<CourseCategory>(fallbackCategory);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastSyncedQueryTokenRef = useRef("");

  useEffect(() => {
    const hasActiveCategory = categories.some((category) => category.id === activeCategory);

    if (!requestedCategoryToken) {
      if (!hasActiveCategory) {
        setActiveCategory(fallbackCategory);
      }
      lastSyncedQueryTokenRef.current = "";
      return;
    }

    const queryChanged = lastSyncedQueryTokenRef.current !== requestedCategoryToken;

    if (queryChanged || !hasActiveCategory) {
      setActiveCategory(validRequestedCategory);
    }

    lastSyncedQueryTokenRef.current = requestedCategoryToken;
  }, [
    activeCategory,
    categories,
    fallbackCategory,
    requestedCategoryToken,
    validRequestedCategory,
  ]);

  useEffect(() => {
    const activeButton = categoryButtonRefs.current[activeCategory];
    if (!activeButton) {
      return;
    }

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCategory]);

  const activeMeta = useMemo(
    () => categories.find((category) => category.id === activeCategory),
    [activeCategory, categories]
  );

  const visibleCourses = useMemo(
    () => courses.filter((course) => course.category === activeCategory),
    [activeCategory, courses]
  );

  const categoryTabs = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: courses.filter((course) => course.category === category.id).length,
      })),
    [categories, courses]
  );

  return (
    <section className="relative pb-16 no-dark-gradient">
      <div
        className="pointer-events-none absolute inset-x-0 -top-4 h-72 rounded-[2.2rem] bg-gradient-to-br from-transparent to-transparent dark:from-accent/7 dark:via-primary/8 dark:to-transparent"
        aria-hidden="true"
      />

      <div className="home-panel relative mb-6 rounded-[2.1rem] p-5 dark:border-accent/22 dark:bg-gradient-to-br dark:from-[#0a1c34] dark:via-[#0d2643] dark:to-[#0a1f39] sm:mb-8 sm:p-7">
        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-3">
          Complete Catalog
        </p>
        <h1 className="text-2xl sm:text-4xl font-black text-primary dark:text-white mb-2 sm:mb-3">
          Courses For All Levels
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
          Explore Quran, Computer, Media, Language, and Academic Tutoring tracks. Every category
          includes beginner-friendly to advanced support so students can grow at their pace.
        </p>
      </div>

      {loading ? (
        <p className="mb-5 text-sm text-slate-500 dark:text-slate-300">Refreshing latest catalog...</p>
      ) : null}

      <div className="home-panel mb-6 rounded-2xl p-3 sm:mb-7 sm:p-4">
        <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
          Choose Category
        </div>
        <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max min-w-full gap-2 snap-x snap-mandatory sm:w-auto sm:min-w-0 sm:flex-wrap sm:gap-3">
            {categoryTabs.map((category) => (
            <button
              key={category.title}
              type="button"
              ref={(node) => {
                categoryButtonRefs.current[category.id] = node;
              }}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "shrink-0 snap-start rounded-xl border px-3 py-2 text-left text-xs font-bold transition-all sm:px-4 sm:py-2.5 sm:text-sm",
                activeCategory === category.id
                  ? "border-accent bg-accent text-primary shadow-sm sm:border-primary sm:bg-primary sm:text-white dark:border-accent dark:bg-accent dark:text-primary"
                  : "home-card text-primary hover:border-accent dark:border-white/12 dark:bg-[#0b223f]/88 dark:text-slate-100"
              )}
            >
              <span className="block whitespace-nowrap">{category.title}</span>
              <span className={cn(
                "mt-0.5 block text-[10px] font-semibold opacity-75",
                activeCategory === category.id ? "text-primary/80 sm:text-white/80" : "text-slate-500 dark:text-slate-300"
              )}>
                {category.count} courses
              </span>
            </button>
            ))}
          </div>
        </div>
      </div>

      {activeMeta ? (
        <div className="mb-6 flex flex-col items-start gap-2 sm:mb-7 sm:flex-row sm:items-center sm:gap-3">
          <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full", activeMeta.badgeClassName)}>
            {activeMeta.title}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-200 sm:text-sm">{activeMeta.description}</p>
        </div>
      ) : null}

      <div className="rounded-[1.9rem] p-0 dark:border dark:border-white/8 dark:bg-gradient-to-b dark:from-[#0a213c]/65 dark:to-[#071a32]/45 dark:p-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
          >
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                badgeClassName={activeMeta?.badgeClassName ?? "bg-gray-100 text-gray-700"}
                onViewDetails={setSelectedCourse}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </section>
  );
}
