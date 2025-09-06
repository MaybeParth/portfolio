// src/components/hero.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
        <p className="text-sm text-muted-foreground">Portfolio</p>

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

        {/* CTA buttons */}
        <div className="mt-6 flex gap-3">
          <a href="#projects" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
            View Projects
          </a>
          <a href="/Parth_Kulkarni_Resume.pdf" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
            Download Resume
          </a>
        </div>

        {/* Subcopy */}
        <p className="mt-6 max-w-2xl text-muted-foreground">
          I build fast, reliable apps for web & mobile. Here are a few things I’ve shipped.
        </p>
      </motion.div>
    </section>
  );
}
