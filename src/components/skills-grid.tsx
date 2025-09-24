"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skills } from "@/lib/data";

type IconMap = Record<string, string>;

// Map skill names to Devicon classes (https://devicon.dev/)
const iconMap: IconMap = {
  "Next.js": "devicon-nextjs-plain",
  React: "devicon-react-plain",
  TypeScript: "devicon-typescript-plain",
  JavaScript: "devicon-javascript-plain",
  "Tailwind CSS": "devicon-tailwindcss-plain",
  "Node.js": "devicon-nodejs-plain",
  Express: "devicon-express-original",
  PostgreSQL: "devicon-postgresql-plain",
  Redis: "devicon-redis-plain",
  Python: "devicon-python-plain",
  Flutter: "devicon-flutter-plain",
  Dart: "devicon-dart-plain",
  Java: "devicon-java-plain",
  Selenium: "devicon-selenium-original",
  Salesforce: "devicon-salesforce-plain",
  LWC: "devicon-salesforce-plain",
  "React Native": "devicon-react-plain",
  Docker: "devicon-docker-plain",
  AWS: "devicon-amazonwebservices-plain",
  Git: "devicon-git-plain",
  Jenkins: "devicon-jenkins-plain",
  SQLite: "devicon-sqlite-plain",
  Firebase: "devicon-firebase-plain",
};


export default function SkillsGrid() {
  const items = useMemo(() => {
    if (!Array.isArray(skills)) return [];
    return skills.slice(0, 26);
  }, []);
  const [touchedItems, setTouchedItems] = useState<Set<string>>(new Set());

  return (
    <section id="skills" className="w-full py-12">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="text-center text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Skills
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          A quick snapshot of tools and technologies I use.
        </p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 touch-manipulation">
          {items.map((s, i) => (
            <motion.div
              key={s.text}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
              className="group relative"
            >
              <div
                className={`flex h-28 items-center justify-center rounded-xl border p-3 text-center shadow-sm transition-all duration-200 ${
                  touchedItems.has(s.text) 
                    ? 'bg-card/80 scale-95 shadow-md' 
                    : 'bg-card/60 group-hover:-translate-y-1 group-hover:shadow-md active:scale-95 active:bg-card/80'
                }`}
                role="figure"
                aria-label={s.text}
                onTouchStart={() => {
                  // Add haptic feedback on touch devices
                  if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                  }
                  // Track touched items for visual feedback
                  setTouchedItems(prev => new Set([...prev, s.text]));
                }}
                onTouchEnd={() => {
                  // Reset after a short delay
                  setTimeout(() => {
                    setTouchedItems(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(s.text);
                      return newSet;
                    });
                  }, 150);
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  {s.text.toLowerCase() === "scikit-learn" ? (
                    <ScikitLearnIcon className="mb-2 h-10 w-10 text-foreground opacity-90 group-hover:text-[#F89939] group-hover:opacity-100 transition-colors" />
                  ) : (
                    <span className="relative mb-2 inline-block h-10 w-10">
                      {/* Monochrome */}
                      <i
                        className={`${iconMap[s.text] ?? "devicon-code-plain"} absolute inset-0 flex items-center justify-center text-[2.2rem] leading-none text-foreground opacity-90 transition-opacity group-hover:opacity-0`}
                        aria-hidden
                      />
                      {/* Colored overlay (if available) */}
                      {s.text === "Next.js" ? (
                        <i
                          className={`${iconMap[s.text] ?? "devicon-code-plain"} absolute inset-0 flex items-center justify-center text-[2.2rem] leading-none opacity-0 transition-opacity group-hover:opacity-100 text-black dark:text-white`}
                          aria-hidden
                        />
                      ) : (
                        <i
                          className={`${iconMap[s.text] ?? "devicon-code-plain"} colored absolute inset-0 flex items-center justify-center text-[2.2rem] leading-none opacity-0 transition-opacity group-hover:opacity-100`}
                          aria-hidden
                        />
                      )}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{s.text}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScikitLearnIcon({ className }: { className?: string }) {
  // Minimal theme-aware SVG fallback icon for scikit-learn
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="23" textAnchor="middle" fontSize="12" fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="currentColor">sk</text>
    </svg>
  );
}


