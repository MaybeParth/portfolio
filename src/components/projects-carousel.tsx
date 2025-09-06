// src/components/projects-carousel.tsx
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCard from "@/components/project-card";

type Item = {
  title: string;
  description: string;
  image?: string;
  tech?: string[];
  repo?: string;
  link?: string;
};

export default function ProjectsCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);

  // Keep refs array in sync with items length
  itemRefs.current = items.map((_, i) => itemRefs.current[i] ?? null);

  const scrollTo = useCallback(
    (i: number) => {
      const next = (i + items.length) % items.length;
      setIndex(next);
      itemRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [items.length]
  );

  const onPrev = () => scrollTo(index - 1);
  const onNext = () => scrollTo(index + 1);

  // Sync index while user scrolls/drag-scrolls
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      let best = 0;
      let bestDist = Infinity;
      const mid = el.scrollLeft + el.clientWidth / 2;

      itemRefs.current.forEach((node, i) => {
        if (!node) return;
        // center of the slide relative to the scroll container
        const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
        const dist = Math.abs(nodeCenter - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      setIndex(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative" aria-roledescription="carousel">
      {/* Track: side padding + narrower slides => “peek” neighbors */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 py-2"
      >
        {items.map((p, i) => (
          <div
            key={`${p.title}-${i}`}
            // ✅ IMPORTANT: make the ref callback return void
            ref={(node) => {
              itemRefs.current[i] = node;
            }}
            className="snap-center shrink-0 basis-[88%] md:basis-[72%] lg:basis-[64%] xl:basis-[56%]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <ProjectCard
              title={p.title}
              description={p.description}
              image={p.image}
              tech={p.tech}
              repo={p.repo}
              link={p.link}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous project"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm hover:bg-accent"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next project"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-background p-2 shadow-sm hover:bg-accent"
      >
        <ChevronRight size={18} />
      </button>

      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" />

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full border ${
              index === i ? "bg-foreground" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
