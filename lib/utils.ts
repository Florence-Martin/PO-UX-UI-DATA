import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple nanoid alternative
export function nanoid(): string {
  return Math.random().toString(36).substring(2, 11);
}
