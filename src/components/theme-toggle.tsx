// src/components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // avoid SSR/CSR mismatch: render a placeholder until mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-hidden
        tabIndex={-1}
        className="rounded-xl border px-3 py-2 text-sm hover:bg-accent opacity-0 pointer-events-none"
      >
        <Sun size={16} />
      </button>
    );
  }

  // show the *destination* icon:
  // dark now -> show Sun (tap to go light), light now -> show Moon (tap to go dark)
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className="rounded-xl border px-3 py-2 text-sm hover:bg-accent"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

