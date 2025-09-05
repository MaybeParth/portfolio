"use client";
import { motion } from "framer-motion";
import { useTypewriterCycle } from "@/hooks/use-typewriter-cycle";

export default function Hero() {
  // Line 1: your name + adjectives (as you wrote)
  const adjectives = [
    "Parth Kulkarni",
    "Curious",
    "Relentless",
    "A Builder",
    "A Problem Solver",
  ];
  const {
    text: nameText,
    blink: blinkName,
  } = useTypewriterCycle(adjectives, {
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseBetweenWords: 1200,
  });

  // Line 2: your roles (Software Engineer, ML Engineer, etc.)
  const roles = ["Software Engineer", "Mobile & Web Developer", "ML Engineer"];
  const {
    text: roleText,
    blink: blinkRole,
  } = useTypewriterCycle(roles, {
    typingSpeed: 80,
    deletingSpeed: 40,
    pauseBetweenWords: 1200,
  });

  return (
    <section className="py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-muted-foreground">Portfolio</p>

        {/* Line 1 — Name/Adjectives */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2">
          Hi, I’m{" "}
          <span className="whitespace-pre">{nameText}</span>
          <span
            className={`ml-1 inline-block h-[1em] w-[2px] bg-current align-[-0.1em] transition-opacity ${
              blinkName ? "opacity-100" : "opacity-0"
            }`}
          />
        </h1>

        {/* Line 2 — Roles */}
        <p className="mt-3 text-lg md:text-xl text-muted-foreground">
          <span className="whitespace-pre">{roleText}</span>
          <span
            className={`ml-1 inline-block h-[1em] w-[2px] bg-current align-[-0.2em] transition-opacity ${
              blinkRole ? "opacity-100" : "opacity-0"
            }`}
          />
        </p>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          I build fast, reliable apps for web & mobile. Here are a few things I’ve shipped.
        </p>

        <div className="mt-6 flex gap-3">
          <a href="#projects" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
            View Projects
          </a>
          <a
            href="/Parth_Kulkarni_Resume.pdf"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-accent"
          >
            Download Resume
          </a>
        </div>
      </motion.div>
    </section>
  );
}
