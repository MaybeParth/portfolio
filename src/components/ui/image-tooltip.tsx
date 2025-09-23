// src/components/ui/image-tooltip.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image, { type StaticImageData } from "next/image";
import { Card } from "@/components/ui/card";

type Placement = "top" | "bottom" | "left" | "right";

export interface ImageItem {
  src: string | StaticImageData;
  alt: string;
  caption?: string;
}

type Props = {
  children: ReactNode;

  // Use ONE: src OR videoSrc OR items[]
  src?: string | StaticImageData;
  videoSrc?: string;
  items?: ImageItem[];

  poster?: string | StaticImageData;

  alt: string;
  caption?: string;

  placement?: Placement;
  delay?: number;
  offset?: number;

  followCursorX?: boolean;
  followCursorY?: boolean;
  followEase?: number;
  yFollowEase?: number;
  maxYDrift?: number;

  // Style hooks
  highlightClassName?: string;
  cardClassName?: string;
  className?: string;

  width?: number;  // default 128
  height?: number; // default 96 (3:2)
  showArrow?: boolean;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function ImageTooltip({
  children,
  src,
  videoSrc,
  items = [],
  poster,
  alt,
  caption,
  placement = "top",
  delay = 70,
  offset = 10,

  followCursorX = true,
  followCursorY = true,
  followEase = 0.34,
  yFollowEase = 0.22,
  maxYDrift = 18,

  // Green underline by default; keep it `nowrap` to prevent line splits.
  highlightClassName = [
    "relative inline-block align-baseline cursor-pointer select-none text-foreground",
    "whitespace-nowrap", // <— important: prevents word from breaking across lines
    // underline (visible by default)
    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px]",
    "after:rounded-full after:bg-emerald-500 dark:after:bg-emerald-400",
    "after:origin-left after:scale-x-100 after:opacity-100",
    // smoothly hide the line WHEN the tooltip is shown
    "data-[active=true]:after:scale-x-0 data-[active=true]:after:opacity-0",
    "after:transition-all after:duration-220 after:ease-out",
  ].join(" "),
  cardClassName = "",
  className = "",

  width,
  height,
  showArrow = false,
}: Props) {
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // NEW: we don’t fade in until we have a measured, correct position
  const [positioned, setPositioned] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // position state (viewport/fixed coords)
  const [coords, setCoords] = useState<{ left: number; top: number }>({
    left: -9999,
    top: -9999,
  });
  const [currentPlacement, setCurrentPlacement] = useState<Placement>(placement);
  const tipWidth = useRef(240);

  // follow refs
  const targetLeft = useRef(0);
  const smoothLeft = useRef(0);
  const baseTopRef = useRef(0);
  const targetTop = useRef(0);
  const smoothTop = useRef(0);
  const rafFollow = useRef<number | null>(null);

  const [timer, setTimer] = useState<number | null>(null);
  const [hideTimer, setHideTimer] = useState<number | null>(null);
  const descId = useId();

  // touch gesture guards to avoid accidental open while scrolling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchMoved = useRef<boolean>(false);
  const touchStartAt = useRef<number>(0);

  const mediaW = width ?? 128;
  const mediaH = height ?? Math.round(mediaW * (3 / 4));

  const posterUrl =
    typeof poster === "string"
      ? poster
      : poster
      ? (poster as StaticImageData).src
      : undefined;

  const gallery = items.length
    ? items
    : src || videoSrc
    ? [{ src: (src as string) || (videoSrc as string), alt, caption }]
    : [];
  const currentItem = gallery[0];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (timer) window.clearTimeout(timer);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (rafFollow.current) cancelAnimationFrame(rafFollow.current);
    };
  }, [timer, hideTimer]);

  const clearTimers = () => {
    if (timer) {
      window.clearTimeout(timer);
      setTimer(null);
    }
    if (hideTimer) {
      window.clearTimeout(hideTimer);
      setHideTimer(null);
    }
  };

  /**
   * 1) Seed position at trigger center BEFORE showing,
   *    using an estimated width/height — prevents “flash far away”.
   */
  const seedAtTrigger = useCallback(() => {
    const trg = triggerRef.current;
    if (!trg) return;
    const rect = trg.getBoundingClientRect();

    const estW = mediaW;
    const estH = mediaH;

    const top =
      placement === "top"
        ? rect.top - (estH + offset)
        : rect.bottom + offset;

    const left = rect.left + rect.width / 2 - estW / 2;

    setCoords({
      left: clamp(left, 12, window.innerWidth - estW - 12),
      top: clamp(top, 12, window.innerHeight - estH - 12),
    });

    // init follow
    targetLeft.current = rect.left + rect.width / 2;
    smoothLeft.current = targetLeft.current;

    const baseTop =
      placement === "top"
        ? rect.top - (estH + offset)
        : rect.bottom + offset;
    baseTopRef.current = baseTop;
    targetTop.current = baseTop;
    smoothTop.current = baseTop;
  }, [mediaW, mediaH, offset, placement]);

  /**
   * 2) Finalize exact position after the tooltip DOM exists.
   *    This reads the real tooltip size and flips placement when needed.
   */
  const finalizePosition = useCallback(() => {
    const trg = triggerRef.current;
    const tip = tipRef.current;
    if (!trg || !tip) return;

    // Temporarily make it measurable
    const prevVis = tip.style.visibility;
    tip.style.visibility = "hidden";
    tip.style.left = "0px";
    tip.style.top = "0px";

    const trgRect = trg.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    tipWidth.current = tipRect.width || mediaW;

    let nextPlacement: Placement = placement;
    let left = trgRect.left + trgRect.width / 2 - tipWidth.current / 2;
    let top =
      placement === "top"
        ? trgRect.top - tipRect.height - offset
        : trgRect.bottom + offset;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;

    // Flip if outside viewport
    if (placement === "top" && top < margin) {
      nextPlacement = "bottom";
      top = trgRect.bottom + offset;
    } else if (placement === "bottom" && top + tipRect.height > vh - margin) {
      nextPlacement = "top";
      top = trgRect.top - tipRect.height - offset;
    }

    left = clamp(left, margin, vw - tipWidth.current - margin);
    top = clamp(top, margin, vh - tipRect.height - margin);

    // Restore visibility AFTER calculating
    tip.style.visibility = prevVis;

    setCurrentPlacement(nextPlacement);
    setCoords({ left, top });

    // Sync follow baselines with final numbers
    baseTopRef.current = top;
    targetLeft.current = left + tipWidth.current / 2;
    smoothLeft.current = targetLeft.current;
    targetTop.current = top;
    smoothTop.current = top;
  }, [mediaW, offset, placement]);

  /**
   * SHOW: seed immediately, mount tooltip hidden, then finalize in layout,
   * then reveal (fade/scale) once positioned.
   */
  const show = useCallback(() => {
    clearTimers();
    seedAtTrigger();
    setPositioned(false);
    setVisible(true);
  }, [seedAtTrigger]);

  /**
   * HIDE with a tiny delay to allow exit transition.
   */
  const hide = useCallback(() => {
    clearTimers();
    setIsAnimating(false);
    const id = window.setTimeout(() => {
      setVisible(false);
      setPositioned(false);
    }, 150);
    setHideTimer(id);

    if (rafFollow.current) {
      cancelAnimationFrame(rafFollow.current);
      rafFollow.current = null;
    }
  }, []);

  /**
   * On first mount of the portal, compute exact placement synchronously
   * before first painted frame (layout effect), then reveal.
   */
  useLayoutEffect(() => {
    if (!visible) return;
    finalizePosition();
    setPositioned(true);
    // start entrance after it’s positioned
    requestAnimationFrame(() => setIsAnimating(true));
  }, [visible, finalizePosition]);

  // Reposition on resize/scroll while open
  useLayoutEffect(() => {
    if (!visible) return;
    const onReflow = () => {
      finalizePosition();
    };
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, { passive: true });
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow);
    };
  }, [visible, finalizePosition]);

  // Pointer follow (X + subtle Y drift)
  useEffect(() => {
    if (!visible || (!followCursorX && !followCursorY)) return;

    const onMove = (e: PointerEvent) => {
      const half = tipWidth.current / 2;
      const margin = 12;
      const minX = margin + half;
      const maxX = window.innerWidth - margin - half;

      if (followCursorX) {
        targetLeft.current = clamp(e.clientX, minX, maxX);
      }
      if (followCursorY) {
        const trgRect = triggerRef.current?.getBoundingClientRect();
        const midY = trgRect ? trgRect.top + trgRect.height / 2 : e.clientY;
        const relY = e.clientY - midY;
        const drift = clamp(relY * 0.2, -maxYDrift, maxYDrift);
        targetTop.current = baseTopRef.current + drift;
      }

      if (rafFollow.current == null) {
        const step = () => {
          const dx = targetLeft.current - smoothLeft.current;
          smoothLeft.current += dx * followEase;

          let top = baseTopRef.current;
          if (followCursorY) {
            const dy = targetTop.current - smoothTop.current;
            smoothTop.current += dy * yFollowEase;
            top = smoothTop.current;
          }

          setCoords({
            left: smoothLeft.current - half,
            top,
          });

          const doneX = Math.abs(dx) < 0.08;
          const doneY = !followCursorY || Math.abs(targetTop.current - smoothTop.current) < 0.2;
          if (doneX && doneY) {
            smoothLeft.current = targetLeft.current;
            if (followCursorY) smoothTop.current = targetTop.current;
            rafFollow.current = null;
            return;
          }
          rafFollow.current = requestAnimationFrame(step);
        };
        rafFollow.current = requestAnimationFrame(step);
      }
    };

    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (rafFollow.current) {
        cancelAnimationFrame(rafFollow.current);
        rafFollow.current = null;
      }
    };
  }, [visible, followCursorX, followCursorY, followEase, yFollowEase, maxYDrift]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        tipRef.current?.contains(e.target as Node)
      )
        return;
      hide();
    };
    document.addEventListener("mousedown", onDocClick, true);
    return () => document.removeEventListener("mousedown", onDocClick, true);
  }, [hide]);

  const origin =
    currentPlacement === "top"
      ? "50% 100%"
      : currentPlacement === "bottom"
      ? "50% 0%"
      : currentPlacement === "left"
      ? "100% 50%"
      : "0% 50%";

  return (
    <>
      <span
        ref={triggerRef}
        className={`${highlightClassName} ${className}`}
        data-active={visible}
        onMouseEnter={() => {
          const id = window.setTimeout(show, delay);
          setTimer(id);
        }}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStartX.current = t.clientX;
          touchStartY.current = t.clientY;
          touchMoved.current = false;
          touchStartAt.current = Date.now();
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          const dx = Math.abs(t.clientX - touchStartX.current);
          const dy = Math.abs(t.clientY - touchStartY.current);
          if (dx > 8 || dy > 8) touchMoved.current = true;
        }}
        onTouchEnd={() => {
          const duration = Date.now() - touchStartAt.current;
          const isTap = !touchMoved.current && duration < 300;
          if (!isTap) return; // ignore scrolls/long drags
          seedAtTrigger();
          setPositioned(false);
          setVisible((v) => !v);
        }}
        role="button"
        tabIndex={0}
        aria-describedby={visible ? descId : undefined}
        aria-expanded={visible}
        style={{ cursor: "pointer" }}
      >
        {children}
      </span>

      {mounted && visible
        ? createPortal(
            <div
              ref={tipRef}
              id={descId}
              className="fixed z-50 pointer-events-none select-none"
              style={{
                left: coords.left,
                top: coords.top,
                // Hide the tooltip entirely until we've measured & positioned it
                visibility: positioned ? "visible" : "hidden",
                transformOrigin: origin,
                willChange: "transform, opacity, left, top",
                opacity: positioned && isAnimating ? 1 : 0,
                transform: `translateZ(0) scale(${positioned && isAnimating ? 1 : 0.92})`,
                transition:
                  positioned
                    ? "transform 160ms cubic-bezier(.3,.7,.4,1.2), opacity 140ms ease"
                    : "none",
              }}
              data-placement={currentPlacement}
              aria-hidden
            >
              {showArrow && (
                <div
                  className={[
                    "absolute size-2 rotate-45 bg-white shadow-sm",
                    currentPlacement === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
                    currentPlacement === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
                    currentPlacement === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
                    currentPlacement === "right" && "left-[-4px] top-1/2 -translate-y-1/2",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              )}

              <Card
                className={[
                  "pointer-events-auto rounded-md overflow-hidden p-0 m-0 bg-transparent",
                  "shadow-lg",
                  cardClassName || "",
                ].join(" ")}
              >
                <div
                  className="relative overflow-hidden rounded-md"
                  style={{ width: mediaW, height: mediaH }}
                >
                  {typeof (currentItem?.src ?? src) === "string" &&
                  (currentItem?.src as string)?.includes(".mp4") ? (
                    <video
                      src={(currentItem?.src as string) ?? (videoSrc as string)}
                      poster={posterUrl}
                      width={mediaW}
                      height={mediaH}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={currentItem?.alt ?? alt}
                    />
                  ) : (
                    <Image
                      src={
                        (currentItem?.src as string | StaticImageData) ??
                        (src as string | StaticImageData)
                      }
                      alt={currentItem?.alt ?? alt}
                      width={mediaW}
                      height={mediaH}
                      sizes={`${mediaW}px`}
                      className="absolute inset-0 w-full h-full object-cover"
                      priority={false}
                    />
                  )}

                  {(currentItem?.caption || caption) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/15 to-transparent h-10 pointer-events-none" />
                  )}
                </div>

                {(currentItem?.caption || caption) && (
                  <div className="absolute bottom-0 inset-x-0 px-3 py-2 text-xs text-white/98 font-medium">
                    {currentItem?.caption || caption}
                  </div>
                )}
              </Card>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
