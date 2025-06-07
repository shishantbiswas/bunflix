import React from "react";
import { SearchBarFocusProvider } from "@/context/search-context";
import TanstackProvider from "@/context/tanstack-provider";
import { TransitionProvider } from "@/context/transition-context";
import { ShowProvider } from "./show-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackProvider>
      <TransitionProvider>
        <SearchBarFocusProvider>
          <ShowProvider>
            {children}
          </ShowProvider>
        </SearchBarFocusProvider>
      </TransitionProvider>
    </TanstackProvider>
  );
}
