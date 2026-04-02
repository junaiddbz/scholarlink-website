import { adminDb } from "@/lib/firebase-admin";
import {
  isAnnouncementActive,
  sortAnnouncements,
  type AnnouncementItem,
} from "@/lib/announcements";
import {
  COURSE_CATEGORIES,
  COURSES,
  type Course,
  type CourseCategoryMeta,
} from "@/lib/courses";
import { FACULTY_MEMBERS, type FacultyMember } from "@/lib/faculty";
import { REVIEWS, type ReviewItem } from "@/lib/reviews";

const categoriesCollection = "categories";
const coursesCollection = "courses";
const facultyCollection = "faculty";
const reviewsCollection = "reviews";
const announcementsCollection = "announcements";
const readCacheTtlMs = Number(process.env.CATALOG_READ_CACHE_TTL_MS ?? "30000");
const fallbackMode = (process.env.CATALOG_FALLBACK_MODE ?? "bootstrap-only").toLowerCase();

type CachedRead = {
  value: unknown;
  expiresAt: number;
};

const readCache = new Map<string, CachedRead>();
const inFlightReads = new Map<string, Promise<unknown>>();

function isCacheEnabled() {
  return Number.isFinite(readCacheTtlMs) && readCacheTtlMs > 0;
}

function shouldUseFallback() {
  return fallbackMode !== "off";
}

function getCached<T>(cacheKey: string): T | null {
  if (!isCacheEnabled()) {
    return null;
  }

  const entry = readCache.get(cacheKey);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    readCache.delete(cacheKey);
    return null;
  }

  return entry.value as T;
}

function setCached<T>(cacheKey: string, value: T) {
  if (!isCacheEnabled()) {
    return;
  }

  readCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + readCacheTtlMs,
  });
}

async function loadWithCache<T>(cacheKey: string, loader: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const inFlight = inFlightReads.get(cacheKey);
  if (inFlight) {
    return inFlight as Promise<T>;
  }

  const promise = loader()
    .then((value) => {
      setCached(cacheKey, value);
      return value;
    })
    .finally(() => {
      inFlightReads.delete(cacheKey);
    });

  inFlightReads.set(cacheKey, promise as Promise<unknown>);
  return promise;
}

function invalidateCollectionCache(collectionName: string) {
  const prefix = `${collectionName}:`;

  for (const key of Array.from(readCache.keys())) {
    if (key.startsWith(prefix)) {
      readCache.delete(key);
    }
  }

  for (const key of Array.from(inFlightReads.keys())) {
    if (key.startsWith(prefix)) {
      inFlightReads.delete(key);
    }
  }
}

function fallbackOnEmptyCollection<T>(items: T[]): T[] {
  return shouldUseFallback() ? items : [];
}

function nowIso() {
  return new Date().toISOString();
}

function withAuditFields<T extends { createdAt?: string; updatedAt?: string; updatedBy?: string | null }>(
  data: T,
  actorEmail?: string
) {
  const timestamp = nowIso();
  return {
    ...data,
    createdAt: data.createdAt ?? timestamp,
    updatedAt: timestamp,
    updatedBy: actorEmail ?? null,
  };
}

export async function readCategories(includeArchived = false): Promise<CourseCategoryMeta[]> {
  const cacheKey = `${categoriesCollection}:${includeArchived ? "all" : "active"}`;

  return loadWithCache(cacheKey, async () => {
    if (includeArchived) {
      const snapshot = await adminDb.collection(categoriesCollection).get();
      if (snapshot.empty) {
        return fallbackOnEmptyCollection(COURSE_CATEGORIES);
      }

      return snapshot.docs.map((doc) => doc.data() as CourseCategoryMeta);
    }

    // Query-side filtering keeps payloads smaller for public reads.
    const activeSnapshot = await adminDb
      .collection(categoriesCollection)
      .where("isArchived", "==", false)
      .get();

    if (!activeSnapshot.empty) {
      return activeSnapshot.docs.map((doc) => doc.data() as CourseCategoryMeta);
    }

    // If the filtered query is empty, check if the collection is truly empty.
    const fullSnapshot = await adminDb.collection(categoriesCollection).get();
    if (fullSnapshot.empty) {
      return fallbackOnEmptyCollection(COURSE_CATEGORIES);
    }

    const items = fullSnapshot.docs.map((doc) => doc.data() as CourseCategoryMeta);
    return items.filter((item) => item.isArchived !== true);
  });
}

export async function readCourses(includeArchived = false): Promise<Course[]> {
  const cacheKey = `${coursesCollection}:${includeArchived ? "all" : "active"}`;

  return loadWithCache(cacheKey, async () => {
    if (includeArchived) {
      const snapshot = await adminDb.collection(coursesCollection).get();
      if (snapshot.empty) {
        return fallbackOnEmptyCollection(COURSES);
      }

      return snapshot.docs.map((doc) => doc.data() as Course);
    }

    const activeSnapshot = await adminDb
      .collection(coursesCollection)
      .where("isArchived", "==", false)
      .get();

    if (!activeSnapshot.empty) {
      return activeSnapshot.docs.map((doc) => doc.data() as Course);
    }

    const fullSnapshot = await adminDb.collection(coursesCollection).get();
    if (fullSnapshot.empty) {
      return fallbackOnEmptyCollection(COURSES);
    }

    const items = fullSnapshot.docs.map((doc) => doc.data() as Course);
    return items.filter((item) => item.isArchived !== true);
  });
}

export async function readFaculty(includeArchived = false): Promise<FacultyMember[]> {
  const cacheKey = `${facultyCollection}:${includeArchived ? "all" : "active"}`;

  return loadWithCache(cacheKey, async () => {
    if (includeArchived) {
      const snapshot = await adminDb.collection(facultyCollection).get();
      if (snapshot.empty) {
        return fallbackOnEmptyCollection(FACULTY_MEMBERS);
      }

      return snapshot.docs.map((doc) => doc.data() as FacultyMember);
    }

    const activeSnapshot = await adminDb
      .collection(facultyCollection)
      .where("isArchived", "==", false)
      .get();

    if (!activeSnapshot.empty) {
      return activeSnapshot.docs.map((doc) => doc.data() as FacultyMember);
    }

    const fullSnapshot = await adminDb.collection(facultyCollection).get();
    if (fullSnapshot.empty) {
      return fallbackOnEmptyCollection(FACULTY_MEMBERS);
    }

    const items = fullSnapshot.docs.map((doc) => doc.data() as FacultyMember);
    return items.filter((item) => item.isArchived !== true);
  });
}

export async function readReviews(includeUnpublished = false): Promise<ReviewItem[]> {
  const cacheKey = `${reviewsCollection}:${includeUnpublished ? "all" : "published"}`;

  return loadWithCache(cacheKey, async () => {
    if (includeUnpublished) {
      const snapshot = await adminDb.collection(reviewsCollection).get();
      if (snapshot.empty) {
        return fallbackOnEmptyCollection(REVIEWS);
      }

      return snapshot.docs.map((doc) => doc.data() as ReviewItem);
    }

    const publishedSnapshot = await adminDb
      .collection(reviewsCollection)
      .where("isPublished", "==", true)
      .get();

    if (!publishedSnapshot.empty) {
      return publishedSnapshot.docs.map((doc) => doc.data() as ReviewItem);
    }

    const fullSnapshot = await adminDb.collection(reviewsCollection).get();
    if (fullSnapshot.empty) {
      return fallbackOnEmptyCollection(REVIEWS.filter((item) => item.isPublished));
    }

    const items = fullSnapshot.docs.map((doc) => doc.data() as ReviewItem);
    return items.filter((item) => item.isPublished);
  });
}

export async function readAnnouncements(includeUnpublished = false): Promise<AnnouncementItem[]> {
  const cacheKey = `${announcementsCollection}:${includeUnpublished ? "all" : "active"}`;

  return loadWithCache(cacheKey, async () => {
    const nowMs = Date.now();

    if (includeUnpublished) {
      const snapshot = await adminDb.collection(announcementsCollection).get();
      if (snapshot.empty) {
        return [];
      }

      const items = snapshot.docs.map((doc) => doc.data() as AnnouncementItem);
      return sortAnnouncements(items);
    }

    const publishedSnapshot = await adminDb
      .collection(announcementsCollection)
      .where("isPublished", "==", true)
      .get();

    if (!publishedSnapshot.empty) {
      const activeItems = publishedSnapshot.docs
        .map((doc) => doc.data() as AnnouncementItem)
        .filter((item) => isAnnouncementActive(item, nowMs));
      return sortAnnouncements(activeItems);
    }

    const fullSnapshot = await adminDb.collection(announcementsCollection).get();
    if (fullSnapshot.empty) {
      return [];
    }

    const items = fullSnapshot.docs
      .map((doc) => doc.data() as AnnouncementItem)
      .filter((item) => isAnnouncementActive(item, nowMs));
    return sortAnnouncements(items);
  });
}

export async function upsertCategory(data: CourseCategoryMeta, actorEmail?: string) {
  await adminDb
    .collection(categoriesCollection)
    .doc(data.id)
    .set(withAuditFields({ ...data, isArchived: data.isArchived ?? false }, actorEmail), {
      merge: true,
    });

  invalidateCollectionCache(categoriesCollection);
}

export async function createCategory(
  data: Omit<CourseCategoryMeta, "id">,
  actorEmail?: string
): Promise<CourseCategoryMeta> {
  const ref = adminDb.collection(categoriesCollection).doc();
  const record: CourseCategoryMeta = {
    ...data,
    id: ref.id,
  };

  await ref.set(withAuditFields({ ...record, isArchived: record.isArchived ?? false }, actorEmail), {
    merge: true,
  });

  invalidateCollectionCache(categoriesCollection);

  return record;
}

export async function upsertCourse(data: Course, actorEmail?: string) {
  await adminDb
    .collection(coursesCollection)
    .doc(data.id)
    .set(withAuditFields({ ...data, isArchived: data.isArchived ?? false }, actorEmail), {
      merge: true,
    });

  invalidateCollectionCache(coursesCollection);
}

export async function createCourse(
  data: Omit<Course, "id">,
  actorEmail?: string
): Promise<Course> {
  const ref = adminDb.collection(coursesCollection).doc();
  const record: Course = {
    ...data,
    id: ref.id,
  };

  await ref.set(withAuditFields({ ...record, isArchived: record.isArchived ?? false }, actorEmail), {
    merge: true,
  });

  invalidateCollectionCache(coursesCollection);

  return record;
}

export async function upsertFaculty(data: FacultyMember, actorEmail?: string) {
  await adminDb
    .collection(facultyCollection)
    .doc(data.id)
    .set(withAuditFields({ ...data, isArchived: data.isArchived ?? false }, actorEmail), {
      merge: true,
    });

  invalidateCollectionCache(facultyCollection);
}

export async function createFaculty(
  data: Omit<FacultyMember, "id">,
  actorEmail?: string
): Promise<FacultyMember> {
  const ref = adminDb.collection(facultyCollection).doc();
  const record: FacultyMember = {
    ...data,
    id: ref.id,
  };

  await ref.set(withAuditFields({ ...record, isArchived: record.isArchived ?? false }, actorEmail), {
    merge: true,
  });

  invalidateCollectionCache(facultyCollection);

  return record;
}

export async function upsertReview(data: ReviewItem, actorEmail?: string) {
  await adminDb
    .collection(reviewsCollection)
    .doc(data.id)
    .set(withAuditFields(data, actorEmail), { merge: true });

  invalidateCollectionCache(reviewsCollection);
}

export async function upsertAnnouncement(data: AnnouncementItem, actorEmail?: string) {
  await adminDb
    .collection(announcementsCollection)
    .doc(data.id)
    .set(withAuditFields(data, actorEmail), { merge: true });

  invalidateCollectionCache(announcementsCollection);
}

export async function createReview(
  data: Omit<ReviewItem, "id">,
  actorEmail?: string
): Promise<ReviewItem> {
  const ref = adminDb.collection(reviewsCollection).doc();
  const record: ReviewItem = {
    ...data,
    id: ref.id,
  };

  await ref.set(withAuditFields(record, actorEmail), { merge: true });
  invalidateCollectionCache(reviewsCollection);
  return record;
}

export async function createAnnouncement(
  data: Omit<AnnouncementItem, "id">,
  actorEmail?: string
): Promise<AnnouncementItem> {
  const ref = adminDb.collection(announcementsCollection).doc();
  const record: AnnouncementItem = {
    ...data,
    id: ref.id,
  };

  await ref.set(withAuditFields(record, actorEmail), { merge: true });
  invalidateCollectionCache(announcementsCollection);
  return record;
}

export async function setCategoryArchived(id: string, isArchived: boolean, actorEmail?: string) {
  await adminDb.collection(categoriesCollection).doc(id).set(
    {
      isArchived,
      updatedAt: nowIso(),
      updatedBy: actorEmail ?? null,
    },
    { merge: true }
  );

  invalidateCollectionCache(categoriesCollection);
}

export async function setCourseArchived(id: string, isArchived: boolean, actorEmail?: string) {
  await adminDb.collection(coursesCollection).doc(id).set(
    {
      isArchived,
      updatedAt: nowIso(),
      updatedBy: actorEmail ?? null,
    },
    { merge: true }
  );

  invalidateCollectionCache(coursesCollection);
}

export async function setFacultyArchived(id: string, isArchived: boolean, actorEmail?: string) {
  await adminDb.collection(facultyCollection).doc(id).set(
    {
      isArchived,
      updatedAt: nowIso(),
      updatedBy: actorEmail ?? null,
    },
    { merge: true }
  );

  invalidateCollectionCache(facultyCollection);
}

export async function deleteCategory(id: string) {
  await adminDb.collection(categoriesCollection).doc(id).delete();
  invalidateCollectionCache(categoriesCollection);
}

export async function deleteCourse(id: string) {
  await adminDb.collection(coursesCollection).doc(id).delete();
  invalidateCollectionCache(coursesCollection);
}

export async function deleteFaculty(id: string) {
  await adminDb.collection(facultyCollection).doc(id).delete();
  invalidateCollectionCache(facultyCollection);
}

export async function deleteReview(id: string) {
  await adminDb.collection(reviewsCollection).doc(id).delete();
  invalidateCollectionCache(reviewsCollection);
}

export async function deleteAnnouncement(id: string) {
  await adminDb.collection(announcementsCollection).doc(id).delete();
  invalidateCollectionCache(announcementsCollection);
}
