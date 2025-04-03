// ZigZagLine.tsx
"use client";

import { motion } from "framer-motion";

export function ZigZagLine() {
  return (
    <motion.svg
      className="absolute left-1/2 -translate-x-1/2 h-full w-[40px] z-0 pointer-events-none"
      viewBox="0 0 20 1000"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ strokeDashoffset: 1000 }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      <path
        d="M10,0 Q0,50 10,100 Q20,150 10,200 Q0,250 10,300 Q20,350 10,400 Q0,450 10,500 Q20,550 10,600 Q0,650 10,700 Q20,750 10,800 Q0,850 10,900 Q20,950 10,1000"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 10"
      />
    </motion.svg>
  );
}
