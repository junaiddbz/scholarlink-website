export const dynamic = "force-dynamic";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrustSignals } from "@/components/trust-signals";
import { AnnouncementRail } from "@/components/announcement-rail";
import { CourseCatalog } from "@/components/course-catalog";
import { Faculty } from "@/components/faculty";
import { ReviewTeaser } from "@/components/review-teaser";
import { Admissions } from "@/components/admissions";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { MobileBar } from "@/components/mobile-bar";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-accent shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="min-h-screen pt-28 pb-20 focus:outline-none lg:pb-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid items-stretch gap-4 sm:mb-10 sm:gap-5 lg:mb-14 lg:grid-cols-12 lg:gap-6">
            <Hero />
            <div className="lg:hidden">
              <AnnouncementRail sectionId="announcements-mobile" className="mb-0" />
            </div>
            <TrustSignals />
          </div>

          <div className="hidden lg:block">
            <AnnouncementRail />
          </div>
          <CourseCatalog />
          <Faculty />
          <ReviewTeaser />
          <Admissions />
          <Footer />
        </div>
      </main>

      <BackToTop />
      <MobileBar />
    </>
  );
}
