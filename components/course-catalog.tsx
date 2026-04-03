"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { BookOpen, GraduationCap, Laptop, Video, Languages } from "lucide-react";
import { useCatalogData } from "@/hooks/use-catalog-data";

const CATEGORY_ICONS = {
  quran: BookOpen,
  computer: Laptop,
  media: Video,
  academic: GraduationCap,
  language: Languages,
} as const;

export function CourseCatalog() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { categories, courses } = useCatalogData();

  const categoryCards = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: courses.filter((course) => course.category === category.id).length,
      })),
    [categories, courses]
  );

  return (
    <section id="courses" className="mb-8 scroll-mt-28 sm:mb-10 lg:mb-14" ref={ref}>
      <motion.div
        className="home-panel rounded-[2.1rem] px-5 py-6 sm:px-7"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-xs">
              Learning Paths
            </span>
            <h3 className="mt-2 text-3xl font-black text-primary dark:text-white">
              Find Your Best-Fit Program
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Choose your track and instantly view courses matched to your goals,
              level, and learning style across academics, Quran, computer, media,
              and language programs.
            </p>
          </div>

          <Link
            href="/courses?category=academic"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-primary text-primary dark:text-accent font-bold text-sm hover:bg-primary hover:text-white transition-colors"
          >
            Browse Complete Course Catalog
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
        >
          {categoryCards.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] ?? GraduationCap;
            return (
            <motion.article
              key={category.title}
              className="home-card z-0 rounded-[2rem] p-6 transition-all hover:border-accent hover:shadow-[0_20px_50px_-28px_rgba(3,44,96,0.72)] sm:p-7"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gradient-to-br dark:from-primary/30 dark:to-accent/20 dark:text-accent">
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${category.badgeClassName}`}
                >
                  {category.count} Courses
                </span>
              </div>

              <h4 className="text-2xl font-black text-primary dark:text-white mb-2">
                {category.title}
              </h4>
              <p className="mb-6 min-h-[42px] text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {category.description}
              </p>

              <Link
                href={`/courses?category=${category.id}`}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-colors"
              >
                Explore {category.title}
              </Link>
            </motion.article>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
