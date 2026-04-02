"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    const onCourseModalState = (event: Event) => {
      const customEvent = event as CustomEvent<{ open?: boolean }>;
      setIsCourseModalOpen(Boolean(customEvent.detail?.open));
    };

    setIsCourseModalOpen(document.body.classList.contains("course-modal-open"));
    window.addEventListener("course-modal-state", onCourseModalState as EventListener);

    return () => window.removeEventListener("course-modal-state", onCourseModalState as EventListener);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && !isCourseModalOpen && (
        <motion.button
          onClick={scrollToTop}
          className="fixed right-6 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary text-accent shadow-lg transition hover:border-accent/40 hover:shadow-xl dark:border-accent/30 dark:shadow-[0_10px_28px_-16px_rgba(234,170,0,0.55)] bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] lg:bottom-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ y: -4, boxShadow: "0 8px 30px rgba(0, 40, 85, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
