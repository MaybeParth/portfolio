"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

type NavLink = { href: string; label: string };

const LINKS: ReadonlyArray<NavLink> = [
  { href: "/#projects", label: "Projects" },      // still hidden for now
  { href: "/experience", label: "Experience" },   // ✅ new page link
  { href: "/Parth_Resume_SDE.pdf", label: "Resume" },
] as const;

// Hide only Projects for now (show Experience)
const HIDDEN = new Set<NavLink["label"]>(["Projects"]);

export default function Navbar() {
  const pathname = usePathname();
  const navLinks = LINKS.filter(l => !HIDDEN.has(l.label));

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto max-w-5xl flex items-center justify-between py-3 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          Parth Kulkarni
        </Link>

        <nav className="flex items-center gap-4">
          {navLinks.map((l) => {
            const isResume = l.label === "Resume";
            const isActive = pathname === l.href; // highlights /experience when on that page
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
