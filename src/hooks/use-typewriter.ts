"use client";
import { useEffect, useState } from "react";

/**
 * Strict-Mode safe typewriter.
 * Renders text progressively via slice (no skipped letters).
 */
export function useTypewriter(text: string, speed = 90) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || index > text.length) return;
    
    const timeoutId = setTimeout(() => setIndex((i) => i + 1), speed);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [index, text, speed, mounted]);

  // Return empty string during SSR to prevent hydration mismatch
  return mounted ? text.slice(0, Math.min(index, text.length)) : "";
}
