// src/app/experience/page.tsx
import type { Metadata } from "next";
import ExperienceStacked from "@/components/experience-stacked"; 

export const metadata: Metadata = {
  title: "Experience — Parth Kulkarni",
  description: "Work history, responsibilities, and impact.",
};

export default function ExperiencePage() {
  return <ExperienceStacked />;
}
