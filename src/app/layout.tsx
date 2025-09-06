// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ThemeProvider from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Parth Kulkarni — Portfolio",
  description: "Software Engineer • Mobile & Web • ML",
  openGraph: {
    title: "Parth Kulkarni — Portfolio",
    description: "Software Engineer • Mobile & Web • ML",
    url: "https://your-domain.com",
    siteName: "Parth Kulkarni",
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://your-domain.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"      // first visit = dark
          enableSystem     // only change when user toggles
          storageKey="pk-theme"    // persistent key in localStorage
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto max-w-5xl px-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
