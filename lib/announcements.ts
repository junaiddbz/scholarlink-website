export type AnnouncementPriority = 1 | 2 | 3 | 4 | 5;

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  priority: AnnouncementPriority;
  isPublished: boolean;
  isPinned: boolean;
  publishAt?: string | null;
  expiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export interface AnnouncementCtaOption {
  href: string;
  label: string;
  recommendedCtaLabel: string;
}

export const ANNOUNCEMENT_CTA_OPTIONS: AnnouncementCtaOption[] = [
  { href: "/", label: "Home", recommendedCtaLabel: "Go Home" },
  { href: "/courses", label: "Courses (All)", recommendedCtaLabel: "View Courses" },
  {
    href: "/courses?category=academic",
    label: "Courses: Academic",
    recommendedCtaLabel: "Explore Academic Courses",
  },
  {
    href: "/courses?category=quran",
    label: "Courses: Quran",
    recommendedCtaLabel: "Explore Quran Courses",
  },
  {
    href: "/courses?category=computer",
    label: "Courses: Computer",
    recommendedCtaLabel: "Explore Computer Courses",
  },
  {
    href: "/courses?category=media",
    label: "Courses: Media",
    recommendedCtaLabel: "Explore Media Courses",
  },
  {
    href: "/courses?category=language",
    label: "Courses: Language",
    recommendedCtaLabel: "Explore Language Courses",
  },
  { href: "/admissions", label: "Admissions", recommendedCtaLabel: "See Admissions Guide" },
  {
    href: "/admissions#apply-now",
    label: "Admissions: Apply Now",
    recommendedCtaLabel: "Start Application",
  },
  { href: "/reviews", label: "Reviews", recommendedCtaLabel: "Read Reviews" },
  { href: "/experts", label: "Faculty", recommendedCtaLabel: "Meet Faculty" },
  { href: "/about", label: "About Us", recommendedCtaLabel: "Learn More" },
];

export function parseAnnouncementTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function isAnnouncementActive(item: AnnouncementItem, nowMs = Date.now()) {
  if (!item.isPublished) {
    return false;
  }

  const publishAtMs = parseAnnouncementTime(item.publishAt);
  if (publishAtMs !== null && publishAtMs > nowMs) {
    return false;
  }

  const expiresAtMs = parseAnnouncementTime(item.expiresAt);
  if (expiresAtMs !== null && expiresAtMs <= nowMs) {
    return false;
  }

  return true;
}

function getSortTimestamp(item: AnnouncementItem) {
  return (
    parseAnnouncementTime(item.publishAt) ??
    parseAnnouncementTime(item.updatedAt) ??
    parseAnnouncementTime(item.createdAt) ??
    0
  );
}

export function sortAnnouncements(items: AnnouncementItem[]) {
  return [...items].sort((a, b) => {
    const pinnedDiff = Number(b.isPinned) - Number(a.isPinned);
    if (pinnedDiff !== 0) {
      return pinnedDiff;
    }

    const priorityDiff = a.priority - b.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return getSortTimestamp(b) - getSortTimestamp(a);
  });
}

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "announcement-summer-admissions-2026",
    title: "Summer 2026 Admissions Open",
    message:
      "Admissions are now open for Quran, Academic, and Language tracks. Limited evening seats available.",
    ctaLabel: "Apply Now",
    ctaHref: "/admissions#apply-now",
    priority: 1,
    isPublished: true,
    isPinned: true,
    publishAt: "2026-03-25T08:00:00.000Z",
    expiresAt: "2026-06-30T20:00:00.000Z",
  },
  {
    id: "announcement-ielts-weekend-batch",
    title: "New IELTS Weekend Batch",
    message:
      "Weekend IELTS preparation batch starts this month with focused speaking drills and timed writing feedback.",
    ctaLabel: "View Courses",
    ctaHref: "/courses?category=language",
    priority: 2,
    isPublished: true,
    isPinned: false,
    publishAt: "2026-03-28T08:00:00.000Z",
    expiresAt: "2026-07-15T20:00:00.000Z",
  },
  {
    id: "announcement-parent-orientation",
    title: "Parent Orientation Session",
    message:
      "Join our monthly parent orientation to review progress reports, class schedules, and communication guidelines.",
    ctaLabel: "See Admissions Guide",
    ctaHref: "/admissions",
    priority: 3,
    isPublished: true,
    isPinned: false,
    publishAt: "2026-03-30T09:00:00.000Z",
    expiresAt: "2026-06-01T20:00:00.000Z",
  },
];
