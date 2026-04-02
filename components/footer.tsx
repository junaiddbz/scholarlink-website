"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <motion.footer
      className="relative overflow-hidden rounded-[2.5rem] border border-primary/12 bg-gradient-to-br from-white via-[#f8fbff] to-[#eef4fb] px-5 py-8 shadow-[0_30px_75px_-42px_rgba(3,44,96,0.55)] sm:px-6 sm:py-10 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0b203b] dark:via-[#102a4a] dark:to-[#0b223f] dark:shadow-[0_34px_80px_-48px_rgba(234,170,0,0.28)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      role="contentinfo"
    >
      <div
        className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-accent/20 blur-3xl dark:bg-accent/12"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/92 p-1.5 shadow-sm ring-1 ring-primary/8 dark:bg-white/95 dark:px-2 dark:py-1 dark:shadow-md">
            <Image
              src="/logo.png"
              alt="Scholarlink Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
          <div>
            <h3 className="text-lg font-black text-primary dark:text-white leading-none">
              Scholarlink
            </h3>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-400">
              Online Tutors Academy
            </span>
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-300">
              Personalized online learning with expert mentors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
          <motion.a
            href="https://wa.me/923310207775"
            className="flex min-h-[46px] items-center justify-center gap-3 rounded-xl border border-green-200/80 bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 text-xs font-black text-green-700 transition hover:from-green-100 hover:to-emerald-100 dark:border-green-700/80 dark:bg-gradient-to-r dark:from-green-900/40 dark:to-emerald-900/35 dark:text-green-200 dark:hover:from-green-900/55 dark:hover:to-emerald-900/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </motion.a>
          <motion.a
            href="mailto:scholarlinkonlinetutors@gmail.com"
            className="flex min-h-[46px] items-center justify-center gap-3 rounded-xl border border-primary/12 bg-white/85 px-4 py-3 text-[11px] font-black text-slate-700 transition hover:bg-white dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900/85"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-4 h-4" />
            scholarlinkonlinetutors@gmail.com
          </motion.a>
        </div>
      </div>

      <div className="relative mt-7 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-6 text-center dark:border-white/10 lg:flex-row lg:text-left">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} Scholarlink Online Tutors
        </p>
        <div className="flex items-center gap-3">
          {[
            {
              icon: Instagram,
              href: "https://www.instagram.com/scholarlink_online_tutors_",
              label: "Instagram",
            },
            {
              icon: Youtube,
              href: "https://www.youtube.com/@scholarlinkonlinetutors",
              label: "YouTube",
            },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/12 bg-white/80 text-slate-400 transition-colors hover:border-accent/50 hover:text-accent dark:border-white/10 dark:bg-slate-900/65 dark:text-slate-400 dark:hover:border-accent/60 dark:hover:text-accent"
              aria-label={social.label}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <social.icon className="w-4 h-4" />
            </motion.a>
          ))}
          <Link
            href="/admin/login"
            aria-label="Admin login"
            className="h-2 w-2 rounded-full bg-primary/25 opacity-15 transition hover:opacity-90 dark:bg-accent/60"
          />
        </div>
      </div>
    </motion.footer>
  );
}
