"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTypewriterCycle } from "@/hooks/use-typewriter-cycle";
import useMounted from "@/hooks/use-mounted";
import Signature from "./signature";
import { ImageTooltip } from "@/components/ui/image-tooltip";
import DotToHeadshot from "@/components/dot-to-headshot";
import headshot from "/public/parth.jpeg";

export default function Hero() {
  const { text: nameText, blink: blinkName } = useTypewriterCycle(
    ["Parth Kulkarni", "Curious", "Collaborative", "A Builder", "A Problem Solver"],
    { typingSpeed: 80, deletingSpeed: 40, pauseBetweenWords: 1200 }
  );
  const mounted = useMounted();

  const dotRef = useRef<HTMLSpanElement | null>(null);
  const headshotTargetRef = useRef<HTMLDivElement | null>(null);
  const [arrived, setArrived] = useState(false);

  return (
    <>
      {/* PAGE 1 — Big name */}
      <section className="relative w-full px-5">
        <div className="relative flex h-[100svh] items-center justify-center">
          <h1
            aria-label="Parth Kulkarni"
            className="
    relative z-[30]
    font-[var(--font-display)] font-black tracking-[-0.02em]
    leading-[0.85]
    text-[clamp(3.75rem,10.5vw,9.5rem)]
    bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent
    text-center whitespace-nowrap
  "
            suppressHydrationWarning
          >
            Parth&nbsp;Kulkarn
            <span className="relative inline-block align-baseline" aria-hidden="true" suppressHydrationWarning>
              {/* Use dotless i so we control the dot completely */}
              <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                ı
              </span>

              {/* Invisible measurement dot only (no visible dot in the name) */}
              <span
                ref={dotRef}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[0.24em] h-[0.24em] rounded-full opacity-0"
                style={{ 
                  top: "clamp(-0.02em, -0.05em, -0.08em)",
                  width: "clamp(0.2em, 0.24em, 0.28em)",
                  height: "clamp(0.2em, 0.24em, 0.28em)"
                }}
                aria-hidden="true"
              />
            </span>
          </h1>
        </div>
      </section>

      {/* Dot → Headshot (overlay) */}
      <DotToHeadshot
        src={headshot}
        alt="Parth headshot"
        originRef={dotRef}
        targetRef={headshotTargetRef}
        endRadius={12}
        startSize={26}
        liftAt={0.12}            // ⬅️ stays under the H1 until ~12% progress
        endOffsetVH={0.45}       // finish morph slightly earlier than target top so it docks before content shift
        onArrive={() => setArrived(true)}
        onArriveChange={(v) => setArrived(v)}
      />

      {/* PAGE 2 — Content */}
      <section id="hero-content" className="relative w-full px-5 pt-10 md:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start text-left"
        >
          <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight text-foreground" suppressHydrationWarning>
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
          </h2>

          <p className="mt-2 text-lg md:text-xl text-muted-foreground">
            Software Engineer · Mobile & Web Developer · ML Engineer
          </p>

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

            <div className="ml-1 flex items-center gap-2">
              <a
                href="https://github.com/MaybeParth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/parth-pramod-kulkarni-78a049227/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/pque_oh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:parth.kulkarni45@gmail.com"
                aria-label="Email Parth"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-muted-foreground">
            Systems that don’t just work—they <ImageTooltip src="/Flow.mp4" alt="Flow" placement="top" width={90} height={70} followCursorX={true} followCursorY={true} offset={12}>flow</ImageTooltip>.
          </p>

          
        </motion.div>

        {/* 3-COLUMN SHOWCASE */}
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 order-2 md:order-1"
          >
            <p className="text-base leading-7 text-muted-foreground">
              I started problem-solving with{" "}
              {/* <ImageTooltip src={pythonImg} alt="LOGO programming language" placement="top"> */}
                <span className="font-medium text-foreground underline-offset-4">LOGO</span>
              {/* </ImageTooltip>{" "} */}
              {" "}at <span className="font-medium text-foreground">15</span> — then dove into{" "}
              <span className="font-semibold text-foreground">Turbo C++</span> with zero formal software background.
              That curiosity led me into low-level work on the{" "}
              <span className="font-semibold text-foreground">8085</span> microprocessor, and later a bachelor’s where I built projects in{" "}
              <span className="font-semibold text-foreground">Java</span>,{" "}
              <span className="font-semibold text-foreground">
                Python
              </span>
              , and <span className="font-semibold text-foreground">JavaScript</span>.
              I picked up <span className="font-semibold text-foreground">Dart</span> and built a production app for a small-scale startup.
            </p>

            
          </motion.div> 

          {/* Middle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="space-y-6 order-3 md:order-2"
          >
            <p className="text-base leading-7 text-muted-foreground">
              I’m passionate about software engineering and UI/UX design. Frontend development lets
              me blend both — building delightful, accessible experiences with strong engineering
              foundations.
            </p>

            <Signature className="opacity-80 animate-color-cycle text-foreground dark:text-foreground" width={180} height={80} aria-hidden />
          </motion.div>

          {/* Right (destination frame) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="md:justify-self-start order-1 md:order-3"
          >
            <Card className="relative grid aspect-square w-[320px] place-items-center rounded-full border bg-card/50 p-6 shadow-sm md:w-[380px]">
              <div className="absolute inset-0 rounded-full ring-1 ring-border" />
              <div
                ref={headshotTargetRef}
                className="relative size-full rounded-full bg-background/40 overflow-hidden"
              >
                <Image
                  src={headshot}
                  alt="Parth avatar"
                  fill
                  className="h-full w-full object-cover object-top transition-opacity duration-300"
                  style={{ opacity: arrived ? 1 : 0 }}
                  priority={false}
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="relative mt-16 sm:mt-20" />
      </section>
    </>
  );
}
