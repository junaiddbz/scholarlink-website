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

export function useCatalogData() {
  const [categories, setCategories] = useState<CourseCategoryMeta[]>(COURSE_CATEGORIES);
  const [courses, setCourses] = useState<Course[]>(COURSES);
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
          setCategories(categoriesJson.data);
        }

        if (Array.isArray(coursesJson.data)) {
          setCourses(coursesJson.data);
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
