"use client";

import { useEffect, useMemo, useState } from "react";
import { FACULTY_MEMBERS, type FacultyMember } from "@/lib/faculty";

interface ApiResponse<T> {
  data: T;
}

export function useFacultyData() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(FACULTY_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/faculty");
        const json = (await response.json()) as ApiResponse<FacultyMember[]>;

        if (!isMounted) {
          return;
        }

        if (Array.isArray(json.data)) {
          setFaculty(json.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load faculty data.");
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

  const academyHeads = useMemo(
    () => faculty.filter((member) => member.group === "academy-head"),
    [faculty]
  );

  const generalFaculty = useMemo(
    () => faculty.filter((member) => member.group === "general-faculty"),
    [faculty]
  );

  return { faculty, academyHeads, generalFaculty, loading, error };
}
