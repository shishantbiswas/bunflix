"use client";

import React from "react";
import { SearchBarFocusProvider } from "@/context/search-context";
import TanstackProvider from "@/context/tanstack-provider";
import { TransitionProvider } from "@/context/transition-context";
import ObserverProvider from "@/context/observer-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackProvider>
      <TransitionProvider>
        <SearchBarFocusProvider>
          <ObserverProvider>{children}</ObserverProvider>
        </SearchBarFocusProvider>
      </TransitionProvider>
    </TanstackProvider>
  );
}
