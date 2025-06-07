"use client";

import { createContext, ReactNode, useContext, useTransition } from "react";

type State = {
  isPending: boolean;
  startTransition: (callback: () => void) => void;
};

const TransitionContext = createContext<State | null>(null);

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