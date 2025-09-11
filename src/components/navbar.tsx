"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import PronouncePopover from "@/components/pronounce-popover";

type NavLink = { href: string; label: string };

const LINKS: ReadonlyArray<NavLink> = [
  { href: "/#projects", label: "Projects" },      // hidden for now
  { href: "/experience", label: "Experience" },   // page link
  { href: "/Parth_Resume_SDE.pdf", label: "Resume" },
] as const;

const HIDDEN = new Set<NavLink["label"]>(["Projects"]);

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = LINKS.filter((l) => !HIDDEN.has(l.label));

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        {/* Left: Brand + Pronounce button */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold tracking-tight hover:opacity-90">
            Parth Kulkarni
          </Link>

          {/* Speaker button, same styling family as ThemeToggle */}
          <PronouncePopover
            text="Parth Kulkarni"
            // Tune this until it sounds perfect:
            // Try changing "kul-KAR-nee" → "kuhl-KAR-nee" / "kull-KAR-nee" / "kul, KAR, nee"
            speakText="Parth cool-KAR-ni"
            phonetic="Pah-rth kool-KAR-nee"
            lang="en-IN"
            rate={0.9}
            className="ml-1"
          />
        </div>

        {/* Right: Nav + Theme toggle */}
        <nav className="flex items-center gap-3">
          {navLinks.map((l) => {
            const isResume = l.label === "Resume";
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                {...(isResume ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-sm transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
