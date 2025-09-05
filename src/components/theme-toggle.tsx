"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Whenever `dark` changes, update the <html> class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark((d) => !d)}
      className="rounded-xl border px-3 py-2 text-sm hover:bg-accent"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
