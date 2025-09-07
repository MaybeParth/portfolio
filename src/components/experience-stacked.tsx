// src/components/experience-stacked.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from "react";
import { ExternalLink, MapPin, ChevronDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { experience as defaultData } from "@/lib/experience";

type Item = typeof defaultData[number];

type CSSVars = CSSProperties & {
  ["--tiltAddX"]?: string;
  ["--tiltY"]?: string;
};

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));

/** Fixed haptic feedback function */
function useHaptics(value: number) {
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      try {
        // Check if the device supports vibration
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate(25);
        }
      } catch (error) {
        // Silently fail if vibration is not supported
        console.debug('Vibration not supported');
      }
      prev.current = value;
    }
  }, [value]);
}

export default function ExperienceStacked({ items }: { items?: Item[] }) {
  const data = items ?? defaultData;

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0); // 0..1 within current section
  const [scrollProgress, setScrollProgress] = useState(0); // whole timeline 0..1

  useHaptics(activeIndex);

  // Scroll handler: one full viewport per item
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const top = el.scrollTop;
      const total = Math.max(1, el.scrollHeight - el.clientHeight);
      setScrollProgress(top / total);

      const sectionH = Math.max(1, el.clientHeight);
      const idx = Math.floor(top / sectionH);
      const within = clamp((top - idx * sectionH) / sectionH, 0, 1);

      setActiveIndex(clamp(idx, 0, Math.max(data.length - 1, 0)));
      setActiveProgress(within);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [data.length]);

  // Keyboard accessibility (jump between sections)
  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const sectionH = el.clientHeight;
      const targetTop = clamp(idx, 0, Math.max(data.length - 1, 0)) * sectionH;
      el.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [data.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") scrollToIndex(activeIndex + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") scrollToIndex(activeIndex - 1);
      if (e.key === "Home") scrollToIndex(0);
      if (e.key === "End") scrollToIndex(data.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, data.length, scrollToIndex]);

  // ---- MILESTONE LOGIC FOR COMPLETE OPACITY ----
  const i = activeIndex;
  const t = i < data.length - 1 ? activeProgress : 0;

  // Define milestone threshold - card is fully opaque when at start of section
  const milestoneThreshold = 0.15; // First 15% of scroll in section = milestone
  const hold = 0.4; // Hold the current card clearly visible for longer
  const easeOutQuad = (x: number) => 1 - Math.pow(1 - x, 2);
  
  // Check if we're at a milestone (new section start)
  const atMilestone = activeProgress <= milestoneThreshold;
  
  // p starts moving only after the hold window
  const p = t <= hold ? 0 : easeOutQuad((t - hold) / (1 - hold));

  // Compute tilt and shadows based on raw scroll, not the held progress
  const baseTiltX = (0.5 - activeProgress) * 6; // -3..3 degrees
  const shadowStrength = 0.16 + (1 - Math.abs(0.5 - activeProgress) * 2) * 0.1;

  // CURRENT (background as we move on) — stays very opaque & barely shrinks
  const currentScale = 1 - 0.04 * p;
  const currentTranslateY = -8 * p; // slight lift
  
  // MILESTONE LOGIC: Force completely opaque at milestone, then fade normally
  const currentOpacity = atMilestone ? 1 : Math.max(0.3, 1 - 0.12 * p);

  // NEXT (foreground incoming) — starts much later & rises from below
  const nextTranslateY = 36 * (1 - p);
  const nextScale = 0.95 + 0.05 * p;
  const nextOpacity = atMilestone ? 0 : 0.06 + 0.94 * p; // Hide next card at milestone

  const overshootEase = "cubic-bezier(0.175,0.885,0.32,1.275)";

  const currentItem = useMemo(() => data[i], [data, i]);
  const nextItem = useMemo(
    () => (i < data.length - 1 ? data[i + 1] : null),
    [data, i]
  );

  if (!data.length) return null;

  // Ripple refs & logic (very light white ripple on cursor move)
  const activeWrapperRef = useRef<HTMLDivElement | null>(null);
  const rippleRef = useRef<HTMLDivElement | null>(null);
  const lastRippleAt = useRef<number>(0);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = activeWrapperRef.current;
    const rip = rippleRef.current;
    if (!wrap || !rip) return;

    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    rip.style.setProperty("--rpx", `${x}px`);
    rip.style.setProperty("--rpy", `${y}px`);

    // Throttle to avoid re-triggering too fast
    const now = performance.now();
    if (now - lastRippleAt.current > 120) {
      rip.classList.remove("animate-ripple");
      // force reflow to restart animation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      rip.offsetHeight;
      rip.classList.add("animate-ripple");
      lastRippleAt.current = now;
    }
  }, []);

  const clearRipple = useCallback(() => {
    rippleRef.current?.classList.remove("animate-ripple");
  }, []);

  const currentCardStyle: CSSVars = {
    transform: `perspective(1200px) rotateX(calc(${baseTiltX}deg + var(--tiltAddX, 0deg))) rotateY(var(--tiltY, 0deg)) translateY(${currentTranslateY}px) scale(${currentScale})`,
    transition: atMilestone 
      ? "transform 200ms ease, opacity 200ms ease, box-shadow 200ms ease" 
      : "transform 300ms ease, opacity 300ms ease, box-shadow 300ms ease",
    opacity: currentOpacity,
    boxShadow: `0 30px 60px -18px rgba(0,0,0,${shadowStrength})`,
    willChange: "transform, opacity",
  };

  const nextCardStyle: CSSVars = {
    transform: `perspective(1200px) rotateX(calc(${baseTiltX}deg + var(--tiltAddX, 0deg))) rotateY(var(--tiltY, 0deg)) translateY(${nextTranslateY}px) scale(${nextScale})`,
    transition: "transform 300ms ease, opacity 300ms ease, box-shadow 300ms ease",
    opacity: nextOpacity,
    boxShadow: `0 30px 60px -18px rgba(0,0,0,${shadowStrength})`,
    willChange: "transform, opacity",
  };

  return (
    <section
      role="region"
      aria-label="Experience timeline"
      className="relative h-screen bg-background overflow-hidden"
    >
      {/* Desktop progress bar (right side) */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block" aria-hidden>
        <div className="relative">
          <div className="h-64 w-1 overflow-hidden rounded-full bg-border" />
          <div
            className="absolute left-0 top-0 w-1 rounded-full bg-foreground/70 transition-[height] duration-300 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          {/* Milestone dots */}
          <div className="absolute -left-2 top-0 h-full">
            {data.map((_, idx) => (
              <div
                key={idx}
                className={[
                  "absolute h-5 w-5 -translate-y-1/2 rounded-full border-2 border-background transition-all duration-300",
                  idx <= activeIndex ? "bg-foreground shadow" : "bg-muted",
                  // Highlight current milestone
                  idx === activeIndex && atMilestone ? "ring-2 ring-foreground/30 ring-offset-1" : "",
                ].join(" ")}
                style={{
                  top: `${(idx / Math.max(data.length - 1, 1)) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 text-center">
          <ChevronDown className="mx-auto h-4 w-4 animate-bounce text-muted-foreground" />
          <span className="mt-1 block text-xs text-muted-foreground">Scroll</span>
        </div>
      </div>

      {/* Mobile scrollbar (left side) - adjusted positioning */}
      <div className="fixed left-3 top-1/2 z-40 -translate-y-1/2 md:hidden" aria-hidden>
        <div className="relative">
          <div className="h-48 w-1 overflow-hidden rounded-full bg-border/60" />
          <div
            className="absolute left-0 top-0 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500 transition-[height] duration-300 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
          {/* Mobile milestone dots */}
          <div className="absolute -left-1.5 top-0 h-full">
            {data.map((_, idx) => (
              <div
                key={idx}
                className={[
                  "absolute h-4 w-4 -translate-y-1/2 rounded-full border-2 border-background transition-all duration-300",
                  idx <= activeIndex ? "bg-blue-500 shadow-md shadow-blue-500/20" : "bg-muted",
                  // Highlight current milestone on mobile
                  idx === activeIndex && atMilestone ? "ring-1 ring-blue-500/40" : "",
                ].join(" ")}
                style={{
                  top: `${(idx / Math.max(data.length - 1, 1)) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile progress info capsule - now clickable for navigation */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 md:bottom-8">
        <div className="rounded-full bg-background/95 backdrop-blur-md border border-border/50 px-6 py-3 shadow-2xl shadow-black/10">
          {/* Navigation arrows */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="p-1 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 active:scale-95"
              aria-label="Previous experience"
            >
              <ChevronDown className="h-4 w-4 rotate-90 text-foreground" />
            </button>
            
            <div className="text-xs text-muted-foreground font-medium">
              Tap to navigate
            </div>
            
            <button
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === data.length - 1}
              className="p-1 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-foreground/30 active:scale-95"
              aria-label="Next experience"
            >
              <ChevronDown className="h-4 w-4 -rotate-90 text-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm min-w-0">
            <span className="font-semibold text-foreground tabular-nums shrink-0">{activeIndex + 1}</span>
            
            {/* Enhanced progress bar - now clickable */}
            <div className="flex-1 min-w-16 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              const targetIndex = Math.round(percentage * (data.length - 1));
              scrollToIndex(clamp(targetIndex, 0, data.length - 1));
            }}>
              <div className="h-1.5 bg-border/60 rounded-full overflow-hidden relative group hover:h-2 transition-all duration-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${((activeIndex + 1) / data.length) * 100}%` }}
                >
                  {/* Glowing dot at the end */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg shadow-blue-500/40 group-hover:w-2.5 group-hover:h-2.5 transition-all duration-200" />
                </div>
                
                {/* Section markers */}
                <div className="absolute inset-0 flex">
                  {data.map((_, idx) => (
                    <div
                      key={`marker-${idx}`}
                      className="flex-1 border-r border-background/20 last:border-r-0"
                      style={{ width: `${100 / data.length}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <span className="text-muted-foreground tabular-nums shrink-0">{data.length}</span>
          </div>
          
          {/* Current experience info - clickable for current item details */}
          <button 
            className="mt-2 text-center min-w-0 w-full hover:bg-foreground/5 rounded-lg p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/30"
            onClick={() => {
              // Scroll to ensure the current card is perfectly centered
              scrollToIndex(activeIndex);
            }}
          >
            <div className="text-sm font-medium truncate text-foreground">
              {currentItem.role}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {currentItem.company} • {currentItem.start}
            </div>
          </button>
          
          {/* Milestone indicator */}
          {atMilestone && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-blue-500/40" />
            </div>
          )}
        </div>
      </div>

      {/* Internal scroller - with scroll snap */}
      <div
        ref={scrollerRef}
        className="h-full overflow-y-auto scroll-smooth"
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          scrollSnapType: "y mandatory", // Enable scroll snap
          scrollBehavior: "smooth"
        }}
        aria-label="Scroll to browse experience items"
      >
        {/* track height: one full viewport per item with snap points */}
        <div style={{ height: `${data.length * 100}vh` }}>
          {/* Add invisible snap points */}
          {data.map((_, idx) => (
            <div
              key={`snap-${idx}`}
              style={{
                position: 'absolute',
                top: `${idx * 100}vh`,
                height: '100vh',
                width: '100%',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            />
          ))}
        </div>

        {/* CENTERED LAYER — stays pinned; we paint current & next here */}
        {/* Fixed mobile centering with proper padding and safer positioning */}
        <div className="pointer-events-none sticky inset-0 -mt-[100vh] flex h-screen items-center justify-center">
          {/* Current card (always rendered) - adjusted mobile padding */}
          <div
            ref={activeWrapperRef}
            className="relative w-full max-w-3xl px-3 sm:px-4 md:px-6 lg:px-8"
            style={{
              // Better mobile centering - account for safe areas and UI elements
              paddingTop: 'env(safe-area-inset-top, 20px)',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 120px)', // Account for bottom capsule
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={clearRipple}
          >
            <Card
              className={[
                "card-frame relative origin-center pointer-events-auto border-border/50 bg-card shadow-2xl transition-all duration-300",
                // Enhanced styling at milestones
                atMilestone 
                  ? "border-foreground/20 shadow-3xl ring-1 ring-foreground/10" 
                  : "border-border/50"
              ].join(" ")}
              style={currentCardStyle}
            >
              {/* Soft, light ripple overlay (white, very low opacity) */}
              <div
                ref={rippleRef}
                className="pointer-events-none absolute inset-0 rounded-xl ripple-overlay"
              />
              
              {/* Milestone indicator glow */}
              {atMilestone && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-xl pointer-events-none" />
              )}
              
              <CardInner
                item={currentItem}
                active={true}
                ease={overshootEase}
                activeProgress={activeProgress}
                atMilestone={atMilestone}
              />
            </Card>
          </div>

          {/* Next card (overlaps from below, fades in later) - mobile adjustments */}
          {nextItem && !atMilestone && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div 
                className="w-full max-w-3xl px-3 sm:px-4 md:px-6 lg:px-8"
                style={{
                  paddingTop: 'env(safe-area-inset-top, 20px)',
                  paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 120px)',
                }}
              >
                <Card
                  className="relative origin-center border-border/40 bg-card shadow-2xl"
                  style={nextCardStyle}
                  aria-hidden={p === 0}
                >
                  <CardInner
                    item={nextItem}
                    active={p > 0.5} // lets badges/lines feel more "present" after half
                    ease={overshootEase}
                    activeProgress={p}
                    atMilestone={false}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* spacer so last section completes scroll */}
        <div className="h-[40vh]" />
      </div>

      {/* Clean up scrollbars + ripple keyframes */}
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
        .ripple-overlay {
          /* Center defaults (overridden by --rpx/--rpy via JS) */
          --rpx: 50%;
          --rpy: 35%;
          border-radius: 12px;
          opacity: 0;
        }
        .ripple-overlay.animate-ripple {
          animation: ripple-fade 700ms ease-out forwards;
          background: radial-gradient(
            220px 220px at var(--rpx) var(--rpy),
            rgba(255, 255, 255, 0.10) 0%,
            rgba(255, 255, 255, 0.06) 20%,
            rgba(255, 255, 255, 0.03) 40%,
            transparent 65%
          );
          /* slight blur for softness */
          filter: blur(0.6px);
        }
        @keyframes ripple-fade {
          0% {
            opacity: 0.18;
            transform: scale(0.98);
          }
          60% {
            opacity: 0.10;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.06);
          }
        }
      `}</style>
    </section>
  );
}

/* ------------ Card Content ------------- */
function CardInner({
  item,
  active,
  ease,
  activeProgress = 0,
  atMilestone = false,
}: {
  item: Item;
  active: boolean;
  ease: string;
  activeProgress?: number;
  atMilestone?: boolean;
}) {
  const titleId = `${item.company}-${item.role}`.replace(/\s+/g, "-").toLowerCase();

  return (
    <>
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle
              id={titleId}
              className={[
                "mb-1 text-xl leading-tight md:text-2xl transition-all duration-500",
                // Enhanced styling at milestones
                atMilestone ? "text-foreground font-bold" : "text-foreground"
              ].join(" ")}
              style={{
                transform: active
                  ? `translateY(${-(0.5 - activeProgress) * 6}px)`
                  : undefined,
              }}
            >
              {item.role}
            </CardTitle>

            <CardDescription className="text-base">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground transition-colors duration-200",
                      atMilestone ? "text-foreground font-semibold" : ""
                    ].join(" ")}
                    aria-label={`Open ${item.company} in a new tab`}
                  >
                    {item.company}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className={[
                    "font-medium text-foreground transition-colors duration-200",
                    atMilestone ? "font-semibold" : ""
                  ].join(" ")}>
                    {item.company}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={[
                  "font-medium transition-colors duration-200",
                  atMilestone ? "text-foreground" : ""
                ].join(" ")}>
                  {item.start} – {item.end}
                </span>
                {item.location && (
                  <>
                    <span aria-hidden className="text-muted-foreground/60">•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {item.location}
                    </span>
                  </>
                )}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {/* Achievement bullets with stagger */}
        <ul className="mb-6 space-y-3">
          {item.bullets.map((bullet, idx) => (
            <li
              key={idx}
              className={[
                "flex items-start gap-3 text-muted-foreground transition-all",
                active ? "opacity-100" : "opacity-70",
              ].join(" ")}
              style={{
                transitionDuration: "520ms",
                transitionDelay: `${idx * 120}ms`,
                transitionTimingFunction: ease,
                transform: active ? "translateX(0) scale(1)" : "translateX(10px) scale(0.97)",
              }}
            >
              <span
                className={[
                  "mt-2 h-2 w-2 flex-shrink-0 rounded-full transition-colors duration-300",
                  active ? "bg-foreground" : "bg-muted-foreground/40",
                  // Enhanced bullet at milestone
                  atMilestone ? "bg-blue-500 shadow-sm shadow-blue-500/20" : ""
                ].join(" ")}
              />
              <span className="text-sm leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        {!!item.tech?.length && (
          <div className="flex flex-wrap gap-2" aria-label="Technologies used">
            {item.tech.map((t, tIdx) => (
              <Badge
                key={t}
                variant="outline"
                className={[
                  "rounded-full transition-all hover:scale-105 hover:bg-foreground hover:text-background",
                  // Enhanced badges at milestone
                  atMilestone ? "border-foreground/30 bg-foreground/5" : ""
                ].join(" ")}
                style={{
                  transitionDuration: "500ms",
                  transitionDelay: `${300 + tIdx * 70}ms`,
                  transitionTimingFunction: ease,
                  transform: active ? "translateY(0) scale(1)" : "translateY(6px) scale(0.97)",
                  opacity: active ? 1 : 0.75,
                }}
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </>
  );
}