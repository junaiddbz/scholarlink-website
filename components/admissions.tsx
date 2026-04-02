"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { FileEdit, SearchCheck, Users, CheckCircle } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

const steps = [
  { icon: FileEdit, title: "Application", description: "Submit online form", number: "01" },
  { icon: SearchCheck, title: "Evaluation", description: "Document review", number: "02" },
  { icon: Users, title: "Interview", description: "Parent & Student", number: "03" },
  { icon: CheckCircle, title: "Selection", description: "Welcome aboard!", number: "04", featured: true },
];

export function Admissions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="admissions" className="mb-12 scroll-mt-28 lg:mb-14" ref={ref}>
      <motion.div
        className="home-panel relative overflow-hidden rounded-[2.5rem] p-5 sm:p-7 lg:p-9"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="pointer-events-none absolute -left-14 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl dark:bg-accent/12"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, 8, 0], y: [0, -8, 0], opacity: [0.3, 0.48, 0.3] }
          }
          transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-accent/16 blur-3xl dark:bg-primary/16"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, -8, 0], y: [0, 9, 0], opacity: [0.25, 0.42, 0.25] }
          }
          transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-accent mb-2">Admissions Gateway</p>
            <motion.h3
              className="text-2xl sm:text-3xl font-black text-primary dark:text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Admissions Process
            </motion.h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Clear 4-step onboarding with guided enrollment and parent support.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admissions#apply-now"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-accent text-primary text-xs font-bold hover:bg-accent-light transition-colors"
            >
              Start Application
            </Link>
            <Link
              href="/admissions"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl border border-primary/35 text-primary dark:border-white/20 dark:text-slate-100 text-xs font-bold hover:bg-primary hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              View Admissions Guide
            </Link>
          </div>
        </div>

        <motion.div
          className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <div className="hidden xl:block absolute left-[12%] right-[12%] top-1/2 h-px bg-gradient-to-r from-primary/10 via-accent/40 to-primary/10 pointer-events-none" />

          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              className={`relative z-10 p-5 sm:p-6 rounded-[1.75rem] border transition-all duration-300 group ${
                step.featured
                  ? "bg-primary/95 border-accent/70 shadow-[0_10px_30px_rgba(0,40,85,0.35)]"
                    : "home-card hover:border-accent/60"
              }`}
              variants={item}
              whileHover={{ y: -5 }}
            >
              <span
                className={`absolute top-4 right-4 text-4xl sm:text-[42px] leading-none font-black ${
                  step.featured
                    ? "text-white/15"
                    : "text-slate-200 dark:text-slate-700"
                }`}
              >
                {step.number}
              </span>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  step.featured
                    ? "bg-white/10 text-accent"
                    : "bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>

              <h5 className={`font-extrabold text-lg leading-tight ${step.featured ? "text-white" : "text-primary dark:text-white"}`}>
                {step.title}
              </h5>
              <p className={`mt-1.5 text-sm leading-relaxed ${step.featured ? "text-blue-100" : "text-slate-600 dark:text-slate-300"}`}>
                {step.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-6">
          <Link
            href="/admissions"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary dark:text-accent hover:underline"
          >
            View full admissions page
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
