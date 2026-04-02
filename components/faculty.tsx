"use client";

import { useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  type FacultyMember,
  getFacultyImage,
  getFacultyName,
  getFacultyRole,
  getFacultyDegree,
} from "@/lib/faculty";
import { FacultyModal } from "@/components/faculty-modal";
import { useFacultyData } from "@/hooks/use-faculty-data";

export function Faculty() {
  const ref = useRef(null);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const { academyHeads } = useFacultyData();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="faculty" className="mb-12 scroll-mt-28 lg:mb-14" ref={ref}>
      <motion.div
        className="home-panel relative overflow-hidden rounded-[2.4rem] p-6 sm:p-8 lg:p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="pointer-events-none absolute -left-16 top-14 h-56 w-56 rounded-full bg-primary/10 blur-3xl dark:bg-accent/15"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, 9, 0], y: [0, -10, 0], opacity: [0.3, 0.48, 0.3] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-accent/20 blur-3xl dark:bg-primary/20"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, -10, 0], y: [0, 11, 0], opacity: [0.28, 0.46, 0.28] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          aria-hidden="true"
        />

        <div className="relative mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <motion.span
            className="inline-flex items-center rounded-full border border-accent/30 bg-white/80 px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.22em] text-accent shadow-sm dark:border-accent/40 dark:bg-slate-900/70"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            The Authority
          </motion.span>
          <motion.h3
            className="mt-4 text-3xl font-black leading-tight text-primary dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Meet Our Experts
          </motion.h3>
          <motion.p
            className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            Learn from qualified professionals with years of experience in
            shaping academic success.
          </motion.p>
        </div>

        <motion.div
          className="relative grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {academyHeads.map((teacher) => (
            <motion.div
              key={teacher.name}
              className="group relative overflow-hidden rounded-[1.75rem] border border-primary/15 bg-gradient-to-b from-white via-white to-slate-50/85 p-6 text-center shadow-[0_22px_45px_-32px_rgba(3,44,96,0.72)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_58px_-30px_rgba(3,44,96,0.78)] dark:border-white/25 dark:bg-gradient-to-b dark:from-[#f8fafc] dark:via-[#f1f5f9] dark:to-[#e8edf5] dark:shadow-[0_26px_52px_-34px_rgba(4,10,22,0.62)]"
              variants={item}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.09] via-primary/[0.03] to-transparent dark:from-primary/[0.12] dark:via-primary/[0.03]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-[1px] rounded-[1.65rem] border border-white/60 dark:border-white/65"
                aria-hidden="true"
              />

              <motion.div
                className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white/95 shadow-[0_12px_28px_-12px_rgba(3,44,96,0.65)] transition-all duration-300 group-hover:ring-accent/55 dark:ring-white dark:shadow-[0_14px_26px_-12px_rgba(0,0,0,0.55)]"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={getFacultyImage(teacher)}
                  alt={getFacultyName(teacher)}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </motion.div>
              <h4 className="text-lg font-black text-primary dark:text-primary">
                {getFacultyName(teacher)}
              </h4>
              <p className="mt-2 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] text-accent dark:border-accent/35 dark:bg-accent/18 dark:text-[#9a6b00]">
                {getFacultyRole(teacher)}
              </p>
              <p className="mb-5 mt-3 border-t border-primary/10 pt-3 text-sm text-slate-600 dark:border-primary/15 dark:text-slate-600">
                {getFacultyDegree(teacher)}
              </p>

              <motion.button
                type="button"
                onClick={() => setSelectedFaculty(teacher)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_22px_-12px_rgba(0,40,85,0.85)] transition hover:bg-primary-light dark:bg-primary dark:text-white dark:shadow-[0_12px_22px_-14px_rgba(0,40,85,0.62)] dark:hover:bg-primary-light"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Profile
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="relative mt-8 flex justify-center lg:mt-10"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
        >
          <Link
            href="/experts"
            className="inline-flex items-center justify-center rounded-xl border-2 border-primary px-7 py-3 text-sm font-black text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-white dark:border-accent dark:text-accent dark:hover:bg-accent dark:hover:text-primary"
          >
            See Our Faculty
          </Link>
        </motion.div>
      </motion.div>

      <FacultyModal faculty={selectedFaculty} onClose={() => setSelectedFaculty(null)} />
    </section>
  );
}
