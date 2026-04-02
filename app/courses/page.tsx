import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { MobileBar } from "@/components/mobile-bar";
import { CourseGrid } from "@/components/course-grid";
import Link from "next/link";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-accent shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="pt-24 sm:pt-28 pb-28 lg:pb-12 min-h-screen focus:outline-none">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="page-breadcrumb mb-6 text-xs sm:mb-8 sm:text-sm">
            <Link href="/" className="hover:text-primary dark:hover:text-accent transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary dark:text-white font-semibold">Courses</span>
          </div>

          <Suspense
            fallback={<div className="page-breadcrumb py-16 text-center">Loading courses...</div>}
          >
            <CourseGrid />
          </Suspense>
          <Footer />
        </div>
      </main>

      <BackToTop />
      <MobileBar />
    </>
  );
}
