"use client";

import { motion } from "framer-motion";
import { useId } from "react";

const scoreEmoji = {
  5: "😣", // Très intense
  4: "🙁", // Intense
  3: "😐", // Modérée
  2: "🙂", // Faible
  1: "😁", // Très faible
};

const periodColor = {
  Matinée: "bg-blue-500 text-white",
  "Après-midi": "bg-yellow-500 text-black",
  Soirée: "bg-pink-500 text-white",
};

interface UserJourneyZigZagProps {
  steps: {
    title: string;
    period: "Matinée" | "Après-midi" | "Soirée";
    intensity: number;
    icon: React.ElementType;
  }[];
  className?: string;
}

export default function UserJourneyZigZag({
  steps,
  className = "",
}: UserJourneyZigZagProps) {
  const id = useId();

  return (
    <div className={`relative w-full py-20 overflow-x-auto ${className}`}>
      {/* Légende en haut */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground ">
        <span className="flex items-center gap-1">😣 Très intense</span>
        <span className="flex items-center gap-1">🙁 Intense</span>
        <span className="flex items-center gap-1">😐 Modérée</span>
        <span className="flex items-center gap-1">🙂 Faible</span>
        <span className="flex items-center gap-1">😁 Très faible</span>
      </div>

      {/* ZigZag positionné au centre */}
      <motion.svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[1200px] h-24 z-0"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ strokeDashoffset: 1200 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        <path
          d="M0,50 Q150,0 300,50 Q450,100 600,50 Q750,0 900,50 Q1050,100 1200,50"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 12"
        />
      </motion.svg>

      {/* Steps alignés au centre verticalement */}
      <div className="relative z-10 grid grid-flow-col auto-cols-[8rem] gap-6 px-6 w-max mx-auto items-center">
        {steps.map((step, index) => (
          <div
            key={`${id}-${index}`}
            className="grid grid-rows-[auto_auto_auto] justify-items-center text-center gap-1"
          >
            {/* Emoji activité */}
            <div className="flex items-center justify-center bg-muted rounded-full w-10 h-10 mb-2 shadow-sm transition-transform hover:scale-110">
              <step.icon className="h-5 w-5 text-foreground" />
            </div>

            {/* Titre */}
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-tight">
              {step.title}
            </div>

            {/* Période + emoji intensité sur une ligne */}
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-[2px] rounded-full ${
                  periodColor[step.period]
                }`}
              >
                {step.period}
              </span>
              <span
                className="text-2xl"
                title={`Intensité : ${step.intensity}/5`}
                aria-label={`Intensité ${step.intensity} sur 5`}
              >
                <span
                  className="text-2xl"
                  aria-label={`Intensité : ${step.intensity} sur 5`}
                >
                  {scoreEmoji[step.intensity as keyof typeof scoreEmoji]}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
