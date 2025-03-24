import React from "react";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export const ProgressBar = ({ value, className }: ProgressBarProps) => {
  return (
    <div
      className={cn("relative h-4 w-full rounded-full bg-gray-200", className)}
    >
      <div
        className="absolute top-0 left-0 h-4 bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
