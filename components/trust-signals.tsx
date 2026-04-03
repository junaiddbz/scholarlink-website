"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { FileText, Download, GraduationCap, Star, Globe2 } from "lucide-react";
import { useRef } from "react";

export function TrustSignals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.aside
      ref={ref}
      className="mt-0 flex flex-col gap-4 lg:col-span-4 2xl:h-[560px]"
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45 }}
    >
      <div className="hidden 2xl:grid 2xl:grid-cols-1 2xl:gap-3">
        <div className="home-card group flex shrink-0 items-center gap-4 rounded-[2.1rem] p-5 transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 flex items-center justify-center shrink-0 ring-4 ring-blue-50/50 dark:ring-blue-900/20">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-primary dark:text-white">95%</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Graduation Rate
            </p>
          </div>
        </div>

        <div className="home-card group flex shrink-0 items-center gap-4 rounded-[2.1rem] p-5 transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-accent flex items-center justify-center shrink-0 ring-4 ring-amber-50/50 dark:ring-amber-900/20">
            <Star className="w-7 h-7 fill-current" />
          </div>
          <div>
            <span className="block text-2xl font-black text-primary dark:text-white">3.8</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Average GPA
            </p>
          </div>
        </div>

        <div className="home-card group flex shrink-0 items-center gap-4 rounded-[2.1rem] p-5 transition-all duration-300 hover:-translate-y-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ring-4 ring-emerald-50/50 dark:ring-emerald-900/20">
            <Globe2 className="w-7 h-7" />
          </div>
          <div>
            <span className="block text-2xl font-black text-primary dark:text-white">40+</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Nationalities
            </p>
          </div>
        </div>
      </div>

      <motion.a
        href="/prospectus.pdf"
        download
        className="group relative flex min-h-[220px] cursor-pointer flex-col justify-between overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary via-primary-light to-[#002247] p-6 shadow-[0_24px_70px_-44px_rgba(0,40,85,0.9)] lg:min-h-[420px] xl:min-h-[500px] 2xl:min-h-0 2xl:flex-1 dark:border-accent/20 dark:from-[#0b213f] dark:via-[#12345f] dark:to-[#0d2342]"
        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(234, 170, 0, 0.4)" }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                    x: [0, -4, 0],
                  }
            }
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FileText className="w-32 h-32 text-white" />
          </motion.div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-accent text-primary text-[10px] font-bold">
              PDF
            </span>
          </div>
          <h3 className="text-xl font-black text-white mb-1">
            Download<br />Prospectus
          </h3>
          <p className="text-gray-300 text-[11px] leading-relaxed max-w-[200px]">
            Get the full course details and fee structure on your phone.
          </p>
        </div>
        <motion.div
          className="relative z-10 mt-4 flex items-center text-accent text-xs font-bold gap-2"
          whileHover={{ gap: "0.75rem" }}
        >
          <span>Request Download</span>
          <Download className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </motion.aside>
  );
}
