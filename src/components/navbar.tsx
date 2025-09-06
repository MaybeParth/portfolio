// src/components/navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = { href: string; label: string };

// Define your links *here*
const LINKS: ReadonlyArray<NavLink> = [
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/Parth_Resume_SDE.pdf", label: "Resume" },
] as const;

/**
 * QUICK TOGGLE:
 * - Hide Projects/Experience now: keep the Set below as-is.
 * - Show everything later: change to `new Set<NavLink["label"]>()`
 *   or comment the two labels out.
 */
const HIDDEN = new Set<NavLink["label"]>(["Projects", "Experience"]);
// const HIDDEN = new Set<NavLink["label"]>(); // ← show all

export default function Navbar() {
  const pathname = usePathname();

  const navLinks: ReadonlyArray<NavLink> = LINKS.filter(
    (l) => !HIDDEN.has(l.label)
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto max-w-5xl flex items-center justify-between py-3 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Parth Kulkarni
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((l: NavLink) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
