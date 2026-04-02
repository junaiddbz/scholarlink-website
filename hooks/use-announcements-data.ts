"use client";

import { useEffect, useMemo, useState } from "react";
import {
  sortAnnouncements,
  type AnnouncementItem,
} from "@/lib/announcements";

interface ApiResponse<T> {
  data: T;
}

export function useAnnouncementsData() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/announcements");
        const json = (await response.json()) as ApiResponse<AnnouncementItem[]>;

        if (!isMounted) {
          return;
        }

        if (Array.isArray(json.data)) {
          setAnnouncements(sortAnnouncements(json.data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load announcements.");
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

  const rotatingAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);

  return {
    announcements,
    rotatingAnnouncements,
    loading,
    error,
  };
}
