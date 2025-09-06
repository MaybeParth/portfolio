// src/components/hero.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Instagram, Mail } from "lucide-react"; // 👈 new icons
import { useTypewriterCycle } from "@/hooks/use-typewriter-cycle";
import useMounted from "@/hooks/use-mounted";
import headshot from "/public/parth.jpeg";

export default function Hero() {
  const { text: nameText, blink: blinkName } = useTypewriterCycle(
    ["Parth Kulkarni", "Curious", "Relentless", "A Builder", "A Problem Solver"],
    { typingSpeed: 80, deletingSpeed: 40, pauseBetweenWords: 1200 }
  );

  const roleText = "Software Engineer · Mobile & Web Developer · ML Engineer";
  const mounted = useMounted();

  return (
    <section className="py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        {/* Photo */}
        <Image
          src={headshot}
          alt="Parth Kulkarni headshot"
          width={260}
          height={260}
          placeholder="blur"
          priority
          className="mt-3 rounded-full border object-cover object-top
                     w-[160px] h-[160px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] xl:w-[220px] xl:h-[220px]"
        />

        {/* Name */}
        <h1 className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          Hi, I’m{" "}
          <span className="whitespace-pre" suppressHydrationWarning>
            {mounted ? nameText : "Parth Kulkarni"}
          </span>
          {mounted && (
            <span
              aria-hidden
              className={`ml-1 inline-block h-[1em] w-[2px] bg-current align-[-0.1em] transition-opacity ${
                blinkName ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </h1>

        {/* Role */}
        <p className="mt-2 text-lg md:text-xl text-muted-foreground">
          {roleText}
        </p>

        {/* CTA row + socials on the SAME line */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href="#projects" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
            View Projects
          </a>
          <a
            href="/Parth_Resume_SDE.pdf"
            className="rounded-xl border px-4 py-2 text-sm hover:bg-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </a>

          {/* Socials inline */}
          <div className="ml-1 flex items-center gap-2">
            <a
              href="https://github.com/MaybeParth"               // ← update if needed
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/parth-pramod-kulkarni-78a049227/"    // ← replace with your LinkedIn URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>

            <a
              href="https://www.instagram.com/pque_oh/"      // ← replace with your Instagram
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>

            <a
              href="mailto:parth.kulkarni45@gmail.com"                      // ← replace with your email
              aria-label="Email Parth"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>

        {/* Subcopy */}
        <p className="mt-6 max-w-2xl text-muted-foreground">
          I build fast, reliable apps for web & mobile. Here are a few things I’ve shipped.
        </p>
      </motion.div>
    </section>
  );
}
