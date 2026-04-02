"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Target,
  Trophy,
  Instagram,
  Youtube,
  Mail,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/back-to-top";
import { MobileBar } from "@/components/mobile-bar";

const values = [
  {
    title: "Student-First Learning",
    description:
      "We personalize support to each learner's pace, goals, and academic background.",
    icon: HeartHandshake,
  },
  {
    title: "Global Standards",
    description:
      "Our teaching approach aligns with modern academic expectations across regions.",
    icon: Globe,
  },
  {
    title: "Character + Excellence",
    description:
      "We build strong results and strong values through consistency and mentorship.",
    icon: ShieldCheck,
  },
  {
    title: "Future Skills",
    description:
      "Beyond core subjects, we prepare learners for digital and professional pathways.",
    icon: Lightbulb,
  },
];

const outcomes = [
  {
    title: "Clear Academic Direction",
    detail: "Guided subject planning and level-appropriate tutoring roadmaps.",
    icon: Target,
  },
  {
    title: "Exam Confidence",
    detail: "Practice-focused sessions with feedback loops to improve performance.",
    icon: Trophy,
  },
  {
    title: "Long-Term Growth",
    detail: "A foundation in discipline, communication, and independent learning.",
    icon: Globe,
  },
];

export default function AboutPage() {
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
            <span className="text-primary dark:text-white font-semibold">About Us</span>
          </div>

          <motion.section
            className="home-panel mb-10 rounded-[2.5rem] p-8 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent mb-3">
              About Scholarlink
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-primary dark:text-white leading-tight mb-4">
              Empowering Learners Through
              <br />
              Purpose-Driven Education
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Scholarlink Online Tutors is built on one mission: provide high-quality,
              values-centered learning that helps students excel in academics and life. Our
              programs blend subject mastery, confidence building, and future-ready skills for
              learners at every stage.
            </p>
          </motion.section>

          <section className="mb-10">
            <motion.h2
              className="text-2xl sm:text-3xl font-black text-primary dark:text-white mb-6"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              Our Core Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {values.map((value, index) => (
                <motion.article
                  key={value.title}
                  className="home-card rounded-3xl p-6"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent flex items-center justify-center mb-4">
                    <value.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-primary dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <motion.h2
              className="text-2xl sm:text-3xl font-black text-primary dark:text-white mb-6"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35 }}
            >
              Why Families Choose Scholarlink
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {outcomes.map((item, index) => (
                <motion.article
                  key={item.title}
                  className="home-card rounded-3xl p-6"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent-dark dark:text-accent flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-primary dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </motion.article>
              ))}
            </div>
          </section>

          <motion.section
            className="mb-10 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary via-primary-light to-[#002247] p-7 sm:p-9 dark:border-accent/20 dark:from-[#0b213f] dark:via-[#12345f] dark:to-[#0d2342]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Connect With Us</h2>
            <p className="text-sm text-gray-200 mb-6 max-w-2xl">
              Stay updated with our learning community and contact us directly for admissions,
              course guidance, and schedule inquiries.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a
                href="mailto:scholarlinkonlinetutors@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                scholarlinkonlinetutors@gmail.com
              </a>
              <a
                href="https://www.instagram.com/scholarlink_online_tutors_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@scholarlinkonlinetutors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                YouTube
              </a>
            </div>
          </motion.section>

          <Footer />
        </div>
      </main>

      <BackToTop />
      <MobileBar />
    </>
  );
}
