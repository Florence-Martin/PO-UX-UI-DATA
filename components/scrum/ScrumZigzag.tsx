"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import { ScrumCycleLoader } from "./ScrumCycleLoader";
import { ZigZagLine } from "./ZigzagLine";

type ScrumStep = {
  term: string;
  definition: string;
};

export function ScrumZigZag({ steps }: { steps: ScrumStep[] }) {
  return (
    <section className="bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pb-16 px-4">
      <div className="relative max-w-5xl mx-auto">
        <ZigZagLine />
        {/* Ligne centrale */}

        <div className="flex flex-col gap-20 relative z-10">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={step.term}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={clsx(
                  "flex flex-col md:flex-row items-center gap-6 md:gap-12",
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shadow-md z-10">
                  {index + 1}
                </div>

                {/* Branche */}
                <div className="hidden md:block w-4 h-0.5 bg-indigo-200" />

                {/* Carte */}
                <div className="bg-white dark:bg-neutral-900 border border-indigo-100 dark:border-neutral-700 rounded-xl shadow-md p-5 max-w-md w-full">
                  <h3 className="text-indigo-700 dark:text-indigo-300 font-semibold text-lg">
                    {step.term}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    {step.definition}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
