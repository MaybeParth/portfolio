// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider(
  props: React.ComponentProps<typeof NextThemesProvider>
) {
  return <NextThemesProvider {...props} />;
}
