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

  const currentWord = words[wordIndex] || "";

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!currentWord) return;
    if (phase === "typing") {
      if (subIndex < currentWord.length) {
        const t = setTimeout(() => setSubIndex(i => i + 1), typingSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), pauseBetweenWords);
      return () => clearTimeout(t);
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (subIndex > 0) {
        const t = setTimeout(() => setSubIndex(i => i - 1), deletingSpeed);
        return () => clearTimeout(t);
      }
      setWordIndex(i => (i + 1) % words.length);
      setPhase("typing");
    }
  }, [phase, subIndex, currentWord, typingSpeed, deletingSpeed, pauseBetweenWords, words.length]);

  return { text: currentWord.slice(0, subIndex), blink };
}
