"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { MobileBar } from "@/components/mobile-bar";
import {
  type FacultyMember,
  getFacultyImage,
  getFacultyName,
  getFacultyRole,
  getFacultyDegree,
} from "@/lib/faculty";
import { FacultyModal } from "@/components/faculty-modal";
import { useFacultyData } from "@/hooks/use-faculty-data";

export default function ExpertsPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const { academyHeads, generalFaculty, loading } = useFacultyData();

  return (
    <>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-accent shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="pt-28 pb-28 lg:pb-12 min-h-screen focus:outline-none">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="page-breadcrumb mb-8 text-sm">
            <Link href="/" className="hover:text-primary dark:hover:text-accent transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary dark:text-white font-semibold">Experts</span>
          </div>

          <motion.section
            className="home-panel mb-10 rounded-[2.5rem] p-7 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-3">
              The Authority
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-primary dark:text-white leading-tight mb-4">
              Meet Our Experts
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Connect with our academic leadership team and skilled mentors. From academy
              heads to specialist instructors, our faculty is focused on student growth,
              confidence, and consistent outcomes.
            </p>
          </motion.section>

          <section className="home-panel mb-10 rounded-[2rem] p-5 sm:p-7">
            <motion.h2
              className="text-2xl sm:text-3xl font-black text-primary dark:text-white mb-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              Academy Heads
            </motion.h2>
            <motion.p
              className="mb-6 text-sm text-slate-600 dark:text-slate-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              The leadership team guiding curriculum quality, student performance, and
              mentoring standards.
            </motion.p>

            {loading ? <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">Refreshing faculty list...</p> : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {academyHeads.map((teacher, index) => (
                <motion.article
                  key={teacher.name}
                  className="home-card group rounded-[2rem] p-6 text-center transition-all duration-300 hover:shadow-[0_20px_50px_-28px_rgba(3,44,96,0.72)] dark:border-white/12 dark:bg-gradient-to-br dark:from-[#102f52]/94 dark:via-[#13365d]/92 dark:to-[#0f2f50]/94"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg group-hover:ring-accent/30 transition-all duration-300">
                    <Image
                      src={getFacultyImage(teacher)}
                      alt={getFacultyName(teacher)}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <h3 className="font-bold text-primary dark:text-white text-lg">{getFacultyName(teacher)}</h3>
                  <p className="text-xs text-accent font-bold uppercase tracking-wider mt-1">{getFacultyRole(teacher)}</p>
                  <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">{getFacultyDegree(teacher)}</p>

                  <button
                    type="button"
                    onClick={() => setSelectedFaculty(teacher)}
                    className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-light transition w-full dark:bg-accent dark:text-primary dark:hover:bg-accent-light"
                  >
                    View Profile
                  </button>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="home-panel mb-10 rounded-[2rem] p-5 sm:p-7">
            <motion.h2
              className="text-2xl sm:text-3xl font-black text-primary dark:text-white mb-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              General Faculty
            </motion.h2>
            <motion.p
              className="mb-6 text-sm text-slate-600 dark:text-slate-300"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              Dedicated tutors and subject specialists supporting students across core and
              skill-development programs.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {generalFaculty.map((teacher, index) => (
                <motion.article
                  key={teacher.name}
                  className="home-card group rounded-[1.75rem] p-5 text-center transition-all duration-300 hover:shadow-[0_20px_50px_-28px_rgba(3,44,96,0.72)] dark:border-white/12 dark:bg-gradient-to-br dark:from-[#102f52]/94 dark:via-[#13365d]/92 dark:to-[#0f2f50]/94"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                >
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg group-hover:ring-accent/30 transition-all duration-300">
                    <Image
                      src={getFacultyImage(teacher)}
                      alt={getFacultyName(teacher)}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <h3 className="font-bold text-primary dark:text-white text-base leading-tight">{getFacultyName(teacher)}</h3>
                  <p className="text-[11px] text-accent font-bold uppercase tracking-wider mt-1">{getFacultyRole(teacher)}</p>
                  <p className="mb-4 mt-1 text-sm text-slate-500 dark:text-slate-400">{getFacultyDegree(teacher)}</p>

                  <button
                    type="button"
                    onClick={() => setSelectedFaculty(teacher)}
                    className="inline-flex items-center justify-center bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary-light transition w-full dark:bg-accent dark:text-primary dark:hover:bg-accent-light"
                  >
                    View Profile
                  </button>
                </motion.article>
              ))}
            </div>
          </section>

          <Footer />
        </div>
      </main>

      <FacultyModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />

      <BackToTop />
      <MobileBar />
    </>
  );
}
