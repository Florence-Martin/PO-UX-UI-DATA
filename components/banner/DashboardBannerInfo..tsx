"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardBannerInfo = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full z-50 bg-muted text-muted-foreground border-b border-border shadow-md"
        >
          <div className="relative overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-1 sm:px-6">
              <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <div className="relative w-full overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  <span className="text-sm sm:text-base leading-snug inline-block">
                    <strong>Dashboard UX/Data</strong> — Les données affichées
                    sont simulées pour l’instant. L&apos;intégration dynamique
                    est prévue dans les prochaines évolutions du projet.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
