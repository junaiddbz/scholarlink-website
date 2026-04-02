"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  return (
    <motion.section
      ref={ref}
      className="lg:col-span-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="home-panel relative h-[380px] overflow-hidden rounded-[2.5rem] sm:h-[440px] lg:h-[560px] group">
        <motion.div
          className="pointer-events-none absolute -left-12 top-16 h-44 w-44 rounded-full bg-accent/20 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, 8, 0], y: [0, -10, 0], opacity: [0.32, 0.5, 0.32] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute -right-8 top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl dark:bg-accent/14"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: [0, -10, 0], y: [0, 12, 0], opacity: [0.28, 0.42, 0.28] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          aria-hidden="true"
        />

        <motion.div className="absolute inset-0 hero-parallax" style={{ y, opacity }}>
          <Image
            src="/hero-education.svg"
            alt="Students learning together in an online tutoring environment"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 70vw, 60vw"
          />
        </motion.div>
        <div className="absolute inset-0 hero-gradient" />

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10 pb-8 sm:pb-10 lg:pb-12 flex flex-col items-start">
          <motion.div
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent rounded-full text-primary text-[10px] font-bold mb-4 shadow-sm"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -3, 0],
                    opacity: [1, 0.92, 1],
                  }
            }
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Globe className="w-3 h-3" />
            Scholarlink Academy
          </motion.div>

          <motion.h2
            className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Learn Smarter,<br />
            <span className="text-accent">Build Brighter Futures</span>
          </motion.h2>

          <motion.p
            className="text-gray-100 text-xs sm:text-sm lg:text-base font-medium mb-5 sm:mb-8 max-w-full sm:max-w-[88%] lg:max-w-[70%]"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Personal coaching in Academic, Quran, Computer, and Creative tracks.
            Flexible online classes, expert mentors, and clear weekly progress.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row w-full sm:w-auto gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.a
              href="/admissions#apply-now"
              className="w-full sm:w-56 bg-accent hover:bg-accent-light text-primary font-bold py-3.5 rounded-2xl shadow-lg text-center flex items-center justify-center gap-2 min-h-[48px]"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234, 170, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="whitespace-nowrap text-sm">Start Application</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 16 16 12 12 8"></polyline>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </motion.a>
            <motion.div
              className="w-full sm:w-40 rounded-2xl border border-white/30 bg-white/15 py-3.5 text-center font-bold text-white backdrop-blur-md transition hover:bg-white/25 min-h-[48px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/courses?category=academic" className="block w-full h-full text-sm leading-[22px]">
                View Courses
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
