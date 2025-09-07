// src/lib/experience.ts
export type ExperienceItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  location?: string;
  url?: string;
  bullets: string[];
  tech?: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Syracuse University",
    role: "Software Developer",
    start: "Feb 2025",
    end: "Present",
    location: "Syracuse, NY",
    bullets: [
      "Building a cross-platform React Native physiotherapy app using smartphone sensors (Drop Angle, Drop Time, Motor Velocity) for clinical use.",
      "Architected a versioned local patient DB with Async Storage + FS; offline-first and ~40% faster retrieval."
    ],
    tech: ["React Native", "TypeScript", "Sensors", "Async Storage"],
  },
  {
    company: "Syracuse University",
    role: "Research Assistant",
    start: "Feb 2025",
    end: "Present",
    location: "Syracuse, NY",
    bullets: [
      "DNA methylation pipeline in R (minfi) across 450k+ CpG sites for 100+ samples.",
      "Probe-level QC (wateRmelon), batch correction, and 20+ ggplot2 visualizations."
    ],
    tech: ["R", "minfi", "wateRmelon", "ggplot2"],
  },
  {
    company: "MTX Group, Inc.",
    role: "Software Developer Intern",
    start: "May 2024",
    end: "Aug 2024",
    location: "Schenectady, NY",
    bullets: [
      "Built modular LWCs and Apex services; ~40% fewer clicks across 120+ internal users.",
      "Batch jobs for 100k+ records with checkpointing; ~80% faster processing."
    ],
    tech: ["Salesforce", "LWC", "Apex", "Service Cloud"],
  },
  {
    company: "Speech Markers Pvt. Ltd",
    role: "Software Developer Intern",
    start: "May 2023",
    end: "Jul 2023",
    location: "Pune, India",
    bullets: [
      "Led a scalable Flutter app integrating KOHA via REST APIs; reusable widgets + SQLite offline caching for 10k+ students.",
      "CI/CD with GitHub Actions; latency improvements and ~70% smaller app size."
    ],
    tech: ["Flutter", "Dart", "SQLite", "KOHA", "GitHub Actions", "Provider"],
  },
];
