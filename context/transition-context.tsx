"use client";

import { createContext, ReactNode, useContext, useTransition } from "react";

// Define the type for the transition state
type State = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
} | null;

// Create a context for transitions
const TransitionContext = createContext<State>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useGlobalTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useGlobalTransition must be used within a TransitionProvider"
    );
  }
  return context;
};