"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Hobby = {
  title: string;
  description: string;
  image?: string;
  activities?: string[];
};

type Props = {
  hobbies: Hobby[];
  title?: string;
  onMediaClick?: (src: string) => void;
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BookCarousel({ hobbies, title = "Book of Hobbies", onMediaClick }: Props) {
  const defaultIndex = useMemo(() => {
    const pages = hobbies.filter((h) => !!h.image);
    const skiingIdx = pages.findIndex(
      (p) => p.title?.toLowerCase() === "skiing" || (p.image ?? "").toLowerCase().includes("skiing")
    );
    return skiingIdx > -1 ? skiingIdx : 0;
  }, [hobbies]);
  const [index, setIndex] = useState(defaultIndex);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftCoverRef = useRef<HTMLDivElement | null>(null);
  const rightCoverRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const flipPageRef = useRef<HTMLDivElement | null>(null);
  const flippingRef = useRef(false);
  const pagesInnerRef = useRef<HTMLDivElement | null>(null);
  const leftStaticRef = useRef<HTMLDivElement | null>(null);
  const rightStaticRef = useRef<HTMLDivElement | null>(null);
  
  const [rightOverrideIndex, setRightOverrideIndex] = useState<number | null>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  const pages = useMemo(() => hobbies.filter((h) => !!h.image), [hobbies]);
  const count = pages.length;


  const goNext = () => {
    if (flippingRef.current || count === 0) return;
    flippingRef.current = true;
    if (!flipPageRef.current) {
      flippingRef.current = false;
      setIndex((i) => (i + 1) % count);
      return;
    }
    // Prepare flip page with the CURRENT media (outgoing), flipping from right to left
    const nextIdx = (index + 1) % count;
    prepareFlip("next", pages[index]?.image);
    // We'll swap the right page to the NEXT media just after the flip starts
    if (rightStaticRef.current) gsap.set(rightStaticRef.current, { opacity: 0 });
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setIndex(nextIdx);
        gsap.set(flipPageRef.current, { display: "none" });
        
        // Clear override after commit (static now matches state)
        setRightOverrideIndex(null);
        if (pagesInnerRef.current) {
          gsap.fromTo(
            pagesInnerRef.current,
            { opacity: 0.9 },
            { opacity: 1, duration: 0.22, ease: "power1.out" }
          );
        }
        flippingRef.current = false;
      },
    });
    tl.fromTo(
      flipPageRef.current,
      { rotateY: 0, transformOrigin: "left center", opacity: 1 },
      { rotateY: -180, duration: 0.5 }
    )
      .add(() => setRightOverrideIndex(nextIdx), 0.02)
      .to(
      rightStaticRef.current,
      { opacity: 1, duration: 0.12, ease: "power1.out" },
      0.06
    );
  };

  const goPrev = () => {
    if (flippingRef.current || count === 0) return;
    flippingRef.current = true;
    if (!flipPageRef.current) {
      flippingRef.current = false;
      setIndex((i) => (i - 1 + count) % count);
      return;
    }
    const prevIdx = (index - 1 + count) % count;
    // Prepare flip page with the CURRENT media (outgoing) flipping back from left to right
    prepareFlip("prev", pages[index]?.image);
    // Pre-render the previous (target) media on right BEFORE flip so it's already visible during turn
    setRightOverrideIndex(prevIdx);
    if (rightStaticRef.current) gsap.set(rightStaticRef.current, { opacity: 1 });
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        setIndex(prevIdx);
        gsap.set(flipPageRef.current, { display: "none" });
        
        // Clear override after commit
        setRightOverrideIndex(null);
        if (pagesInnerRef.current) {
          gsap.fromTo(
            pagesInnerRef.current,
            { opacity: 0.9 },
            { opacity: 1, duration: 0.22, ease: "power1.out" }
          );
        }
        flippingRef.current = false;
      },
    });
    tl.fromTo(
      flipPageRef.current,
      { rotateY: 0, transformOrigin: "right center", opacity: 1 },
      { rotateY: 180, duration: 0.5 }
    );
  };

  function prepareFlip(direction: "next" | "prev", media?: string) {
    if (!flipPageRef.current) return;
    // Position over the correct half; overlay shows media ONLY on next (right → left). Prev stays blank.
    const el = flipPageRef.current;
    const video = el.querySelector("video") as HTMLVideoElement | null;
    const img = el.querySelector("img") as HTMLImageElement | null;
    if (direction === "next" && media) {
      const isVideo = media.endsWith(".mp4");
      if (isVideo) {
        if (img) img.style.display = "none";
        if (video) {
          video.style.display = "block";
          if (video.src !== media) video.src = media;
          const playSafe = () => video.play().catch(() => {});
          if (video.readyState >= 2) playSafe(); else video.addEventListener("canplay", playSafe, { once: true });
        }
      } else {
        if (video) {
          video.pause();
          video.style.display = "none";
        }
        if (img) {
          img.style.display = "block";
          if (img.src !== media) img.src = media;
          img.alt = "Turning page";
        }
      }
    } else {
      // keep blank for prev
      if (video) {
        video.pause();
        video.style.display = "none";
        video.removeAttribute("src");
        video.load();
      }
      if (img) {
        img.style.display = "none";
        img.removeAttribute("src");
      }
    }
    // Set which half and initial rotation
    if (direction === "next") {
      // starts on right page and flips left
      el.style.left = "50%";
      el.style.right = "auto";
      el.style.transformOrigin = "left center";
      gsap.set(el, { rotateY: 0, display: "block", zIndex: 5, willChange: "transform", transform: "translateZ(0)" });
    } else {
      // starts on left page and flips right (opposite direction)
      el.style.left = "0%";
      el.style.right = "auto";
      el.style.transformOrigin = "right center";
      gsap.set(el, { rotateY: 0, display: "block", zIndex: 5, willChange: "transform", transform: "translateZ(0)" });
    }
  }

  

  useLayoutEffect(() => {
    if (!leftCoverRef.current || !rightCoverRef.current) return;

    const mm = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Initial: closed book — only front (right) cover on top; pages hidden
    gsap.set(leftCoverRef.current, { transformOrigin: "left center", rotateY: 0, zIndex: 1, willChange: "transform" });
    gsap.set(rightCoverRef.current, { transformOrigin: "right center", rotateY: 0, zIndex: 2, willChange: "transform" });
    if (pagesRef.current) gsap.set(pagesRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { opacity: 1, y: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(leftCoverRef.current, { rotateY: -160, duration: 0.6, ease: "power1.inOut" }, 0)
      .to(rightCoverRef.current, { rotateY: 160, duration: 0.6, ease: "power1.inOut" }, 0)
      .to(pagesRef.current, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.12);

    openTlRef.current = tl;

    // Do not auto-open on mount; respect isOpen toggle only

    return () => {
      tl.kill();
      openTlRef.current = null;
    };
  }, []);

  // React to isOpen toggle
  useEffect(() => {
    const tl = openTlRef.current;
    if (!tl) return;
    if (isOpen) {
      tl.play(0);
    } else {
      tl.pause(0);
      tl.time(tl.duration()).reverse();
    }
  }, [isOpen]);

  const current = pages[index];
  const next = pages[(index + 1) % count];

  return (
    <section ref={containerRef} className="py-12 w-full">
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border bg-background/70 backdrop-blur-sm px-4 py-2 text-sm shadow-sm hover:bg-accent transition-colors"
            aria-pressed={isOpen}
          >
            {isOpen ? "Close Book" : "Open Book"}
          </button>
        </div>
        <div
          className="relative mx-auto"
          style={{ width: "880px", maxWidth: "100%", height: "520px", perspective: "1600px" }}
        >
          {/* Page edge stack for diary look */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {/* right stack */}
            <div className="absolute top-3 right-[calc(50%-6px)] bottom-3 w-3 rounded-r bg-foreground/5 shadow-sm" />
            <div className="absolute top-4 right-[calc(50%-10px)] bottom-4 w-2 rounded-r bg-foreground/4" />
            <div className="absolute top-6 right-[calc(50%-13px)] bottom-6 w-1.5 rounded-r bg-foreground/3" />
            {/* left stack */}
            <div className="absolute top-3 left-[calc(50%-6px)] bottom-3 w-3 rounded-l bg-foreground/5 shadow-sm" />
            <div className="absolute top-4 left-[calc(50%-10px)] bottom-4 w-2 rounded-l bg-foreground/4" />
            <div className="absolute top-6 left-[calc(50%-13px)] bottom-6 w-1.5 rounded-l bg-foreground/3" />
          </div>
          {/* Left Cover */}
          <div
            ref={leftCoverRef}
            className="absolute top-0 left-0 h-full w-1/2 rounded-l-xl border shadow-lg bg-gradient-to-br from-stone-100 to-stone-50 dark:from-neutral-800 dark:to-neutral-700 text-foreground dark:text-white border-stone-300/80 dark:border-neutral-600/70"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            {/* subtle texture overlay (stronger in dark) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.06) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.12) 0%, transparent 46%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 pointer-events-none rounded-l-xl ring-1 ring-border/70" />
            <div className="absolute inset-y-0 right-0 w-1 bg-black/10" />
            {/* Cover Title (visible when closed, fades naturally as covers rotate away) */}
            <div className="absolute inset-0 grid place-items-center select-none">
              <div className="text-center px-6">
                <div className="mx-auto mb-2 h-[2px] w-12 rounded-full bg-foreground/20" />
                <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-foreground/70">Book of</div>
                <div className="mt-1 text-2xl md:text-3xl font-extrabold tracking-wide text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-amber-300 dark:via-yellow-200 dark:to-amber-100 drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                  Hobbies
                </div>
                <div className="mx-auto mt-2 h-[2px] w-12 rounded-full bg-foreground/20" />
              </div>
            </div>
          </div>

          {/* Right Cover */}
          <div
            ref={rightCoverRef}
            className="absolute top-0 right-0 h-full w-1/2 rounded-r-xl border shadow-lg bg-gradient-to-br from-stone-100 to-stone-50 dark:from-neutral-800 dark:to-neutral-700 text-foreground dark:text-white border-stone-300/80 dark:border-neutral-600/70"
            style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            {/* subtle texture overlay (stronger in dark) */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07] mix-blend-multiply"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, rgba(0,0,0,0.06) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.12) 0%, transparent 46%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 pointer-events-none rounded-r-xl ring-1 ring-border/70" />
            <div className="absolute inset-y-0 left-0 w-1 bg-black/10" />
            {/* Decorative strap/spine accent */}
            <div className="absolute top-6 bottom-6 left-4 w-2 rounded bg-foreground/10" />
            {/* Closed-cover blurb */}
            <div className="absolute inset-0 grid place-items-center select-none px-6 text-center">
              {/* subtle leather/pattern overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
                   style={{
                     backgroundImage: "repeating-linear-gradient(135deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 6px)",
                   }}
              />

              {/* bookmark ribbon */}
              <div className="absolute -top-1 right-8 h-10 w-3 bg-amber-400 shadow-sm"
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
                   aria-hidden />

              {/* quill watermark */}
              <svg aria-hidden viewBox="0 0 24 24" className="absolute bottom-6 right-6 h-8 w-8 opacity-15 text-foreground">
                <path fill="currentColor" d="M20.5 3.5c-3 0-6.5 2.1-8.6 5.1-1.1 1.5-1.8 3.2-2 4.7l-4.9 4.9c-.4.4-.5 1-.1 1.4.4.4 1 .3 1.4-.1l4.7-4.7c1.6-.3 3.4-1 4.8-2.2 3.1-2.5 5-6 5-9.1 0-.2 0-.2-.1-.2 0 0-.1-.1-.2-.1Z" />
              </svg>

              <div className="relative rounded-xl border border-foreground/15 bg-background/65 backdrop-blur-sm shadow-sm px-6 py-5 max-w-[85%]">
                {/* corner accents */}
                <span className="pointer-events-none absolute -top-1 -left-1 h-3 w-3 border-t border-l border-foreground/30 rounded-tl" />
                <span className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 border-t border-r border-foreground/30 rounded-tr" />
                <span className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-foreground/30 rounded-bl" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-foreground/30 rounded-br" />

                <div className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-2">Hobbies</div>
                <p className="text-sm md:text-base text-foreground leading-relaxed">
                  <span className="italic">Still here? The plot thickens. Crack the cover to meet the rest of me.</span>
                </p>
                <div className="mt-3 mx-auto h-[2px] w-12 rounded-full bg-gradient-to-r from-amber-400/70 to-yellow-200/70" />
              </div>
            </div>
          </div>

          {/* Pages */}
          <div ref={pagesRef} className="absolute inset-0 rounded-xl overflow-hidden bg-background/80 border shadow-sm opacity-0" style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", zIndex: 1 }}>
            <div ref={pagesInnerRef} className="absolute inset-0">
              {/* Left Page: one-liner about the current media */}
              <div ref={leftStaticRef} className="absolute top-0 left-0 h-full w-1/2 p-3 pr-2">
                <TextPage title={current?.title} text={current?.description} side="left" />
              </div>
              {/* Right Page: render current media, but allow override during flip */}
              <div ref={rightStaticRef} className="absolute top-0 right-0 h-full w-1/2 p-3 pl-2">
                <Page
                  media={(rightOverrideIndex != null ? pages[rightOverrideIndex]?.image : current?.image)}
                  title={(rightOverrideIndex != null ? pages[rightOverrideIndex]?.title : current?.title)}
                  side="right"
                  onClick={(src) => onMediaClick?.(src)}
                />
              </div>
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/10" />
            </div>

            

            {/* Flipping overlay page */}
            <div
              ref={flipPageRef}
              className="absolute top-0 h-full w-1/2"
              style={{
                left: "50%",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                display: "none",
                zIndex: 6,
              }}
            >
              <div className="relative h-full w-full rounded-lg overflow-hidden border bg-background">
                <video
                  className="absolute inset-0 h-full w-full object-cover hidden"
                  muted
                  loop
                  playsInline
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="absolute inset-0 h-full w-full object-cover hidden" alt="Hobby" />
                {/* shading to sell the fold */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls (only when book is open) */}
        {isOpen && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2" aria-hidden={!isOpen}>
            <button
              onClick={goPrev}
              aria-label="Previous page"
              className="pointer-events-auto inline-flex items-center justify-center rounded-xl border bg-background/70 backdrop-blur-sm p-2 shadow-sm hover:bg-accent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next page"
              className="pointer-events-auto inline-flex items-center justify-center rounded-xl border bg-background/70 backdrop-blur-sm p-2 shadow-sm hover:bg-accent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Page({ media, title, side, onClick }: { media?: string; title?: string; side: "left" | "right"; onClick?: (src: string) => void }) {
  if (!media) return null;
  const isVideo = media.endsWith(".mp4");

  return (
    <div
      className="relative size-full rounded-lg overflow-hidden border bg-background group cursor-pointer"
      onClick={() => media && onClick?.(media)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && media) {
          e.preventDefault();
          onClick?.(media);
        }
      }}
      aria-label={`View ${title ?? "media"}`}
    >
      {isVideo ? (
        <video
          src={media}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={media}
          alt={title || "Hobby"}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 880px"
          priority={false}
        />
      )}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/10 grid place-items-center">
        <div className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs text-white">Click to view</div>
      </div>
      <div
        className={[
          "pointer-events-none absolute inset-0",
          side === "left"
            ? "bg-gradient-to-r from-black/10 via-transparent to-transparent"
            : "bg-gradient-to-l from-black/10 via-transparent to-transparent",
        ].join(" ")}
      />
      {title && (
        <div className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white/95 drop-shadow">
          {title}
        </div>
      )}
    </div>
  );
}

function TextPage({ title, text, side }: { title?: string; text?: string; side: "left" | "right" }) {
  return (
    <div className="relative size-full rounded-lg overflow-hidden border">
      {/* Light theme lined paper */}
      {side === "left" && (
        <div
          className="absolute inset-0 block dark:hidden"
          style={{
            backgroundColor: '#FAF8F2',
            backgroundImage: 'repeating-linear-gradient(180deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 28px)'
          }}
          aria-hidden
        />
      )}
      {/* Dark theme lined paper */}
      {side === "left" && (
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundColor: '#171717',
            backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 28px)'
          }}
          aria-hidden
        />
      )}

      {/* margin line (notebook style) */}
      {side === "left" && (
        <div className="pointer-events-none absolute inset-y-0 left-8 w-[2px] bg-rose-400/70 dark:bg-rose-300/80" aria-hidden />
      )}

      <div className="absolute inset-0 px-8 py-6 flex flex-col items-center justify-center text-center">
        {title && (
          <h3
            className="mb-2 text-xl md:text-2xl text-foreground/90 dark:text-white/90"
            style={{ fontFamily: 'cursive', letterSpacing: '0.02em' }}
          >
            {title}
          </h3>
        )}
        {text ? (
          <p
            className="text-lg md:text-xl leading-8 text-foreground/90 dark:text-white/90"
            style={{ fontFamily: 'cursive' }}
          >
            {text}
          </p>
        ) : (
          <p className="text-base text-muted-foreground/80 italic">A moment worth remembering.</p>
        )}
      </div>

      <div
        className={[
          "pointer-events-none absolute inset-0",
          side === "left"
            ? "bg-gradient-to-r from-black/10 via-transparent to-transparent dark:from-white/10"
            : "bg-gradient-to-l from-black/10 via-transparent to-transparent dark:from-white/10",
        ].join(" ")}
      />
    </div>
  );
}

function BlankPage({ side }: { side: "left" | "right" }) {
  return (
    <div className="relative size-full rounded-lg overflow-hidden border bg-background">
      <div
        className={[
          "pointer-events-none absolute inset-0",
          side === "left"
            ? "bg-gradient-to-r from-black/6 via-transparent to-transparent"
            : "bg-gradient-to-l from-black/6 via-transparent to-transparent",
        ].join(" ")}
      />
    </div>
  );
}


