# Scholarlink Website (Next.js)

Scholarlink is a production-style Next.js 15 website with Firebase-backed admin content management.

**Live Site:** https://scholarlinktutors.com

It includes public pages for courses, faculty, admissions, reviews, and homepage announcements, plus a protected admin module for managing categories, courses, faculty, reviews, and announcements.

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Auth (client)
- Firebase Admin + Firestore (server)

## Features

- Responsive marketing site with animated sections and modals
- Admin authentication with email allowlist
- Firestore-backed CRUD for:
- Course categories
- Courses
- Faculty
- Reviews (with photo/video/YouTube support)
- Homepage announcements (publish/schedule/expiry)
- Preview-before-commit admin flow for content safety
- Firestore read optimizations:
- Query-side filtering for active/published data
- Short-lived read cache
- Cache invalidation on writes

## Project Structure

```text
scholarlink-next/
	app/
		admin/
		admissions/
		api/
		courses/
		experts/
		reviews/
		layout.tsx
		page.tsx
	components/
		admin/
		announcement-rail.tsx
		course-*.tsx
		faculty*.tsx
		review-*.tsx
	hooks/
		use-announcements-data.ts
		use-catalog-data.ts
		use-faculty-data.ts
		use-reviews-data.ts
	lib/
		admin-auth.ts
		admin-client.ts
		announcements.ts
		catalog-store.ts
		courses.ts
		faculty.ts
		firebase-admin.ts
		firebase-client.ts
		reviews.ts
	scripts/
		seed-firestore-runonce.ts
```

## Environment Variables

Create a local env file (for example `.env.local`) with your Firebase values.

### Client Firebase

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

### Server Firebase Admin

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (newline-preserved key)

### Admin Access

- `ADMIN_EMAILS` (comma-separated allowlist)

### Optional Runtime Controls

- `CATALOG_READ_CACHE_TTL_MS` (default `30000`)
- `CATALOG_FALLBACK_MODE` (`bootstrap-only` by default)

## Local Development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:3000`.
If port 3000 is in use, Next.js will automatically choose another port.

## Seed Firestore Data

Run once:

```bash
npm run seed:runonce
```

Force re-seed:

```bash
npm run seed:runonce:force
```

The seed script populates categories, courses, faculty, reviews, and announcements.

## Build and Validate

```bash
npm run lint
npm run build
npm run start
```

## Admin Module

- Dashboard: `/admin`
- Uses Firebase ID token auth and server-side allowlist checks
- Content management pages are under `/app/admin/*`

## GitHub Push Checklist

Before first push:

1. Confirm secrets are only in local env files.
2. Confirm `.gitignore` excludes `.env*`, `.next`, `node_modules`, and local OS/editor artifacts.
3. Run lint and build locally.
4. Initialize git and commit.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## License

Private - Scholarlink Online Tutors
