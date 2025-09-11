// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/navbar";
import ThemeProvider from "@/components/theme-provider";
import { Bodoni_Moda } from "next/font/google";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400","600", "700", "900"],
  variable: "--font-display",
});

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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="pk-theme"
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto max-w-5xl px-4">
            {children}
          </main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
