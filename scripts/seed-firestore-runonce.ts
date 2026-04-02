import { loadEnvConfig } from "@next/env";
import type { Firestore } from "firebase-admin/firestore";
import { ANNOUNCEMENTS } from "../lib/announcements";
import { COURSE_CATEGORIES, COURSES } from "../lib/courses";
import { FACULTY_MEMBERS } from "../lib/faculty";
import { REVIEWS } from "../lib/reviews";

const SEED_DOC_PATH = "_seed_control/default-catalog-v3";

loadEnvConfig(process.cwd());

interface SeedMarker {
  key: string;
  completedAt: string;
  categories: number;
  courses: number;
  faculty: number;
  reviews: number;
  announcements: number;
  forced: boolean;
}

function nowIso() {
  return new Date().toISOString();
}

async function setDocsInBatches<T extends { id: string }>(
  db: Firestore,
  collectionName: string,
  items: T[],
  actor: string
) {
  const chunkSize = 400;

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const batch = db.batch();

    chunk.forEach((item) => {
      const ref = db.collection(collectionName).doc(item.id);
      const timestamp = nowIso();
      batch.set(
        ref,
        {
          ...item,
          isArchived: false,
          createdAt: timestamp,
          updatedAt: timestamp,
          updatedBy: actor,
        },
        { merge: true }
      );
    });

    await batch.commit();
  }
}

async function run() {
  const { adminDb } = await import("../lib/firebase-admin");
  const force = process.argv.includes("--force");
  const markerRef = adminDb.doc(SEED_DOC_PATH);
  const markerSnap = await markerRef.get();

  if (markerSnap.exists && !force) {
    const marker = markerSnap.data() as SeedMarker;
    console.log("Seed already completed. Skipping.");
    console.log(`Completed at: ${marker.completedAt}`);
    console.log("Use --force to re-run.");
    return;
  }

  const actor = process.env.SEED_ACTOR_EMAIL ?? "seed-script@local";

  await setDocsInBatches(adminDb, "categories", COURSE_CATEGORIES, actor);
  await setDocsInBatches(adminDb, "courses", COURSES, actor);
  await setDocsInBatches(adminDb, "faculty", FACULTY_MEMBERS, actor);
  await setDocsInBatches(adminDb, "reviews", REVIEWS, actor);
  await setDocsInBatches(adminDb, "announcements", ANNOUNCEMENTS, actor);

  await markerRef.set({
    key: "default-catalog-v3",
    completedAt: nowIso(),
    categories: COURSE_CATEGORIES.length,
    courses: COURSES.length,
    faculty: FACULTY_MEMBERS.length,
    reviews: REVIEWS.length,
    announcements: ANNOUNCEMENTS.length,
    forced: force,
  } satisfies SeedMarker);

  console.log("Seed completed successfully.");
  console.log(`Categories: ${COURSE_CATEGORIES.length}`);
  console.log(`Courses: ${COURSES.length}`);
  console.log(`Faculty: ${FACULTY_MEMBERS.length}`);
  console.log(`Reviews: ${REVIEWS.length}`);
  console.log(`Announcements: ${ANNOUNCEMENTS.length}`);
}

run().catch((error) => {
  console.error("Seed failed.");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
