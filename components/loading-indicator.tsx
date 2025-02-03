"use client"

import { useGlobalTransition } from "@/context/transition-context";

export function LoadingIndicator() {
    const { isPending } = useGlobalTransition();
  
    return (
      <div
        className={`fixed top-0 left-0 w-screen h-2 bg-red-700 z-50000 transition-opacity duration-1000 ${
          isPending ? "opacity-100" : "opacity-0"
        }`}
        role="progressbar"
        aria-valuetext={isPending ? "Loading" : "Loaded"}
      >
        <div className="h-full w-full bg-white animate-loading"></div>
      </div>
    );
  }