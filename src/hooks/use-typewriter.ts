"use client";
import { useEffect, useState } from "react";

/**
 * Strict-Mode safe typewriter.
 * Renders text progressively via slice (no skipped letters).
 */
export function useTypewriter(text: string, speed = 90) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > text.length) return;
    const t = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [index, text, speed]);

  return text.slice(0, Math.min(index, text.length));
}
