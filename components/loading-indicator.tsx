"use client"

import { useGlobalTransition } from "@/context/transition-context";

export function LoadingIndicator() {
    const { isPending } = useGlobalTransition();
  
    if(!isPending) return

    return (
      <div
        className={`fixed top-0 left-0 w-screen h-[3px] animate-loading duration-[1200ms] shadow-red-500 shadow-xs bg-red-600 z-50000 transition-opacity ${
          isPending ? "opacity-100" : "opacity-0"
        }`}
        role="progressbar"
        aria-valuetext={isPending ? "Loading" : "Loaded"}
      >
      </div>
    );
  }