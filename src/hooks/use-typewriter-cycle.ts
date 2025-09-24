"use client";
import { useEffect, useState } from "react";

type Phase = "typing" | "pausing" | "deleting";
type Opts = { typingSpeed?: number; deletingSpeed?: number; pauseBetweenWords?: number };

export function useTypewriterCycle(
  words: string[],
  { typingSpeed = 80, deletingSpeed = 40, pauseBetweenWords = 1200 }: Opts = {}
) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [wordIndex, setWordIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [mounted, setMounted] = useState(false);

  const currentWord = words[wordIndex] || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(id);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !currentWord) return;
    
    let timeoutId: NodeJS.Timeout;
    
    if (phase === "typing") {
      if (subIndex < currentWord.length) {
        timeoutId = setTimeout(() => setSubIndex(i => i + 1), typingSpeed);
      } else {
        timeoutId = setTimeout(() => setPhase("pausing"), pauseBetweenWords);
      }
    } else if (phase === "pausing") {
      timeoutId = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (subIndex > 0) {
        timeoutId = setTimeout(() => setSubIndex(i => i - 1), deletingSpeed);
      } else {
        setWordIndex(i => (i + 1) % words.length);
        setPhase("typing");
      }
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mounted, phase, subIndex, currentWord, typingSpeed, deletingSpeed, pauseBetweenWords, words.length]);

  // Return empty text during SSR to prevent hydration mismatch
  return { 
    text: mounted ? currentWord.slice(0, subIndex) : "", 
    blink: mounted ? blink : true 
  };
}
