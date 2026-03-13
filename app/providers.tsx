"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";

function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable.");
  }
  return url;
}

const convexClient = new ConvexReactClient(getConvexUrl());

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider signInUrl="/login" signUpUrl="/signup">
      <ConvexProvider client={convexClient}>
        {children}
        <Toaster richColors position="top-right" />
      </ConvexProvider>
    </ClerkProvider>
  );
}
