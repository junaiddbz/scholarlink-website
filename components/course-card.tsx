"use client";

import { motion } from "framer-motion";
import {
  Atom,
  BookOpen,
  Bot,
  Brain,
  Calculator,
  Code2,
  FlaskConical,
  GraduationCap,
  ImageIcon,
  Landmark,
  Languages,
  LineChart,
  Monitor,
  Dna,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Course, CourseIconKey } from "@/lib/courses";
import { cn } from "@/lib/utils";

const ICONS: Record<CourseIconKey, LucideIcon> = {
  book: BookOpen,
  brain: Brain,
  graduation: GraduationCap,
  code: Code2,
  laptop: Monitor,
  bot: Bot,
  chart: LineChart,
  video: Video,
  image: ImageIcon,
  calculator: Calculator,
  flask: FlaskConical,
  atom: Atom,
  dna: Dna,
  languages: Languages,
  landmark: Landmark,
};

interface CourseCardProps {
  course: Course;
  badgeClassName: string;
  onViewDetails: (course: Course) => void;
}

export function CourseCard({ course, badgeClassName, onViewDetails }: CourseCardProps) {
  const Icon = ICONS[course.icon] ?? GraduationCap;

  return (
    <motion.article
      className={cn(
        "home-card",
        "rounded-[1.5rem] p-4 transition-all duration-300 hover:shadow-[0_20px_50px_-28px_rgba(3,44,96,0.72)] dark:border-white/14 dark:bg-gradient-to-br dark:from-[#123760]/96 dark:via-[#0f3359]/95 dark:to-[#0d2e52]/96 dark:shadow-[0_22px_54px_-34px_rgba(2,14,32,0.8)] dark:hover:border-accent/30 dark:hover:shadow-[0_20px_55px_-30px_rgba(234,170,0,0.32)] sm:rounded-[1.75rem] sm:p-6"
      )}
      whileHover={{ y: -4 }}
      layout
    >
      <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-primary dark:border dark:border-white/20 dark:bg-[#1b446f] dark:text-amber-200 sm:h-11 sm:w-11">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span
          className={cn(
            "whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold",
            badgeClassName
          )}
        >
          {course.level}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-primary dark:text-white mb-2 leading-tight">
        {course.title}
      </h3>

      <p className="mb-4 min-h-0 text-sm leading-relaxed text-slate-600 dark:text-slate-200 sm:mb-5 sm:min-h-[64px]">
        {course.description}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
          {course.subcategory}
        </span>
        <button
          type="button"
          onClick={() => onViewDetails(course)}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-light dark:bg-accent dark:text-primary dark:hover:bg-accent-light sm:w-auto"
        >
          View Details
        </button>
      </div>
    </motion.article>
  );
}
