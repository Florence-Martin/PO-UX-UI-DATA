"use client";

import { motion } from "framer-motion";

export const BetaBadge = () => {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: 1,
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-4 left-4 z-50 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-yellow-600"
    >
      🚧 BETA
    </motion.div>
  );
};
