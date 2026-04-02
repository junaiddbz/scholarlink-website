"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses?category=academic", label: "Courses" },
    { href: "/experts", label: "Faculty" },
    { href: "/reviews", label: "Reviews" },
    { href: "/admissions", label: "Admission" },
    { href: "/about", label: "About Us" },
  ];

  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        const y = window.scrollY;

        setIsScrolled((prev) => {
          const next = y > 50;
          return prev === next ? prev : next;
        });
        rafId = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    const basePath = href.split("?")[0];
    return pathname === basePath;
  };

  return (
    <>
      <motion.header
        className={cn(
          "glass fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={cn(
          "max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 flex justify-between items-center transition-all duration-300",
          isScrolled ? "py-2" : "py-3"
        )}>
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <motion.div
              className="rounded-xl dark:bg-white/95 dark:px-2 dark:py-1 dark:shadow-md"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Image
                src="/logo.png"
                alt="Scholarlink Logo"
                width={168}
                height={56}
                className={cn(
                  "w-auto object-contain transition-all duration-300 dark:brightness-105",
                  isScrolled ? "h-8 sm:h-10" : "h-10 sm:h-12"
                )}
                priority
              />
            </motion.div>
            <div className="block leading-none">
              <p className={cn(
                "font-black text-primary dark:text-white transition-all duration-300",
                isScrolled ? "text-sm sm:text-base" : "text-base sm:text-lg"
              )}>
                Scholarlink
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mt-1">
                Online Tutors Academy
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-bold transition-colors",
                  "text-gray-800 hover:text-primary dark:text-gray-100 dark:hover:text-accent",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-accent",
                  "after:w-0 hover:after:w-full after:transition-all after:duration-300",
                  isLinkActive(link.href) && "after:w-full"
                )}
                onClick={handleNavLinkClick}
              >
                {link.label}
              </Link>
            ))}

            <motion.button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/5 transition-all"
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary dark:text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </motion.button>

            <motion.a
              href="/admissions#apply-now"
              className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234, 170, 0, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Application</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white/85 text-primary shadow-sm backdrop-blur transition hover:border-accent/60 hover:bg-white dark:border-white/20 dark:bg-slate-900/70 dark:text-accent"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </motion.button>

            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-white/85 text-primary shadow-sm backdrop-blur transition hover:border-accent/60 hover:bg-white dark:border-white/20 dark:bg-slate-900/70 dark:text-white"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center overscroll-contain bg-[rgba(243,247,253,0.7)] p-4 backdrop-blur-xl dark:bg-[rgba(5,17,33,0.72)] lg:hidden"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          scale: mobileMenuOpen ? 1 : 1.1,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="home-panel w-full max-w-sm rounded-[1.75rem] p-5 sm:p-6 dark:border-white/15 dark:bg-gradient-to-br dark:from-[#0a223f]/95 dark:via-[#0d2c4d]/94 dark:to-[#0a223e]/95"
          initial={{ opacity: 0, y: 26, scale: 0.96 }}
          animate={{
            opacity: mobileMenuOpen ? 1 : 0,
            y: mobileMenuOpen ? 0 : 26,
            scale: mobileMenuOpen ? 1 : 0.96,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-5 flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent/90">Quick Navigation</p>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 text-primary transition hover:border-accent/60 dark:border-white/15 dark:text-slate-100"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const isActive = isLinkActive(link.href);

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    y: mobileMenuOpen ? 0 : 16,
                  }}
                  transition={{ delay: index * 0.06 + 0.06 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-bold transition",
                      isActive
                        ? "border-accent/50 bg-accent/15 text-primary dark:border-accent/55 dark:bg-gradient-to-r dark:from-accent/20 dark:to-accent/5 dark:text-accent"
                        : "border-primary/10 bg-white/70 text-primary hover:border-accent/35 hover:bg-white/90 dark:border-white/12 dark:bg-white/5 dark:text-slate-100 dark:hover:border-accent/45 dark:hover:bg-white/10"
                    )}
                    onClick={handleNavLinkClick}
                  >
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.a
            href="/admissions#apply-now"
            className="mt-5 flex items-center justify-center rounded-xl bg-accent px-6 py-3.5 text-sm font-black text-primary shadow-sm transition hover:bg-accent-light dark:shadow-[0_16px_30px_-20px_rgba(234,170,0,0.7)]"
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: mobileMenuOpen ? 1 : 0,
              y: mobileMenuOpen ? 0 : 20,
            }}
            transition={{ delay: 0.35 }}
          >
            Start Application
          </motion.a>
        </motion.div>
      </motion.div>
    </>
  );
}
