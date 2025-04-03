"use client";
import scrumStepsData from "@/data/scrumSteps.json";
import { ScrumZigZag } from "./ScrumZigzag";

export default function ScrumPage() {
  return <ScrumZigZag steps={scrumStepsData} />;
}
