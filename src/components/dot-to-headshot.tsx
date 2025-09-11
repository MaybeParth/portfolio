"use client";

import Image, { type StaticImageData } from "next/image";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

type Props = {
  src: string | StaticImageData;
  alt: string;
  originRef: RefObject<HTMLElement | null>;    // the custom dot element in the big name
  targetRef: RefObject<HTMLDivElement | null>; // the image area inside the right card
  endRadius?: number;                           // final rounded corner radius (px), default 12
  startSize?: number;                           // starting dot diameter, default 12
  liftAt?: number;                              // progress at which overlay lifts above text (0..1), default 0.1
  onArrive?: () => void;                        // called once when animation completes
  onArriveChange?: (arrived: boolean) => void;  // called whenever arrival state toggles
  endOffsetVH?: number;                         // how much earlier than target top to finish (in vh), default 0.32
  forceCircle?: boolean;                        // if true, width==height and radius==size/2 across the whole morph
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function DotToHeadshot({
  src,
  alt,
  originRef,
  targetRef,
  endRadius = 9999,
  startSize = 12,
  liftAt = 0.1,
  onArrive,
  onArriveChange,
  endOffsetVH = 0.32,
  forceCircle = true,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(true);

  // Motion values
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const mvW = useMotionValue(startSize);
  const mvH = useMotionValue(startSize);
  const mvR = useMotionValue(startSize / 2);

  const mvDotOpacity = useMotionValue(1);
  const mvImgOpacity = useMotionValue(0);
  const mvImgScale = useMotionValue(0.1);

  const { scrollY } = useScroll();

  const startRef = useRef({
    startY: 0,
    endY: 0,
    measured: false,
  });

  const [zTop, setZTop] = useState(1); // overlay z-index (starts low to sit under the H1)

  const measureRects = () => {
    const oEl = originRef.current;
    const tEl = targetRef.current;
    if (!oEl || !tEl) return null;
    const o = oEl.getBoundingClientRect();
    const t = tEl.getBoundingClientRect();
    const origin = {
      left: o.left,
      top: o.top,
      width: o.width,
      height: o.height,
      cx: o.left + o.width / 2,
      cy: o.top + o.height / 2,
    };
    const target = {
      left: t.left,
      top: t.top,
      width: t.width,
      height: t.height,
    };
    return { origin, target };
  };

  const computeScrollWindow = () => {
    const rects = measureRects();
    if (!rects) return false;

    const docY = window.scrollY;
    const vh = window.innerHeight;

    const originDocCenterY = docY + rects.origin.cy;
    const startY = originDocCenterY - vh * 0.28;

    const targetDocTopY = docY + rects.target.top;
    const endY = targetDocTopY - vh * endOffsetVH;

    startRef.current.startY = startY;
    startRef.current.endY = Math.max(endY, startY + 1);
    startRef.current.measured = true;
    return true;
  };

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const remeasure = () => {
      computeScrollWindow();
      // Initialize overlay position immediately based on current scroll without waiting for scroll event
      const { startY, endY } = startRef.current;
      const curY = window.scrollY;
      const p = startRef.current.measured ? clamp((curY - startY) / (endY - startY), 0, 1) : 0;
      const rects = measureRects();
      if (!rects) return;
      const { origin, target } = rects;
      const originLeft = origin.cx - startSize / 2;
      const originTop = origin.cy - startSize / 2;
      const x = originLeft + (target.left - originLeft) * p;
      const yv = originTop + (target.top - originTop) * p;
      if (forceCircle) {
        const targetSize = Math.min(target.width, target.height);
        const s = startSize + (targetSize - startSize) * p;
        mvX.set(x);
        mvY.set(yv);
        mvW.set(s);
        mvH.set(s);
        mvR.set(s / 2);
      } else {
        const w = startSize + (target.width - startSize) * p;
        const h = startSize + (target.height - startSize) * p;
        const r = (startSize / 2) + (endRadius - startSize / 2) * p;
        mvX.set(x);
        mvY.set(yv);
        mvW.set(w);
        mvH.set(h);
        mvR.set(r);
      }
      if (originRef.current) {
        // Hide the native bouncing dot as soon as scroll begins to avoid double dots
        (originRef.current as HTMLElement).style.opacity = p > 0.001 ? "0" : "1";
      }
      setZTop(p < liftAt ? 1 : 70);
      const dotFade = p < 0.35 ? 1 - p / 0.35 : 0;
      mvDotOpacity.set(dotFade);
      const imgProg = p <= 0.2 ? 0 : p >= 0.7 ? 1 : (p - 0.2) / 0.5;
      mvImgOpacity.set(imgProg);
      mvImgScale.set(0.1 + 0.9 * imgProg);
      if (onArriveChange) onArriveChange(p >= 1);
    };
    remeasure();
    window.addEventListener("resize", remeasure);
    return () => window.removeEventListener("resize", remeasure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, originRef.current, targetRef.current]);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!originRef.current || !targetRef.current) return;
    if (!startRef.current.measured) {
      if (!computeScrollWindow()) return;
    }

    const { startY, endY } = startRef.current;
    const p = clamp((y - startY) / (endY - startY), 0, 1);

    const rects = measureRects();
    if (!rects) return;

    const { origin, target } = rects;
    const originLeft = origin.cx - startSize / 2;
    const originTop = origin.cy - startSize / 2;

    const x = originLeft + (target.left - originLeft) * p;
    const yv = originTop + (target.top - originTop) * p;

    if (forceCircle) {
      const targetSize = Math.min(target.width, target.height);
      const s = startSize + (targetSize - startSize) * p;
      mvX.set(x);
      mvY.set(yv);
      mvW.set(s);
      mvH.set(s);
      mvR.set(s / 2);
    } else {
      const w = startSize + (target.width - startSize) * p;
      const h = startSize + (target.height - startSize) * p;
      const r = (startSize / 2) + (endRadius - startSize / 2) * p;

      mvX.set(x);
      mvY.set(yv);
      mvW.set(w);
      mvH.set(h);
      mvR.set(r);
    }

    // Keep overlay beneath heading until we "lift"
    setZTop(p < liftAt ? 1 : 70);

    // Keep the original heading dot visible until slightly after lift,
    // so it looks like our overlay dot emerges from behind
    if (originRef.current) {
      // Hide the native bouncing dot once animation starts
      (originRef.current as HTMLElement).style.opacity = p > 0.001 ? "0" : "1";
    }

    // Dot fades out early
    const dotFade = p < 0.35 ? 1 - p / 0.35 : 0;
    mvDotOpacity.set(dotFade);

    // Image eases in from 20% → 70%
    const imgProg = p <= 0.2 ? 0 : p >= 0.7 ? 1 : (p - 0.2) / 0.5;
    mvImgOpacity.set(imgProg);
    mvImgScale.set(0.1 + 0.9 * imgProg);

    if (p >= 1) {
      setActive(false);
      if (onArrive) onArrive();
      if (onArriveChange) onArriveChange(true);
    } else {
      if (!active) setActive(true);
      if (onArriveChange) onArriveChange(false);
    }
  });

  useEffect(() => {
    return () => {
      if (originRef.current) {
        (originRef.current as HTMLElement).style.opacity = "1";
      }
    };
  }, [originRef]);

  if (!mounted || !active) return null;

  return createPortal(
    <motion.div
      aria-hidden
      className="fixed pointer-events-none"
      style={{
        left: 0,
        top: 0,
        x: mvX,
        y: mvY,
        width: mvW,
        height: mvH,
        borderRadius: mvR,
        zIndex: zTop, // ⬅️ starts under the H1, then lifts
        willChange: "transform, width, height, border-radius",
      }}
    >
      {/* Dot (under text initially, then fades) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-foreground"
        style={{ opacity: mvDotOpacity }}
      />
      {/* Image (reveals inside the morph) */}
      <motion.div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: mvR, opacity: mvImgOpacity, scale: mvImgScale }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          priority={false}
        />
      </motion.div>
    </motion.div>,
    document.body
  );
}
