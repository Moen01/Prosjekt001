'use client';

import { createContext, useContext, useState, type ReactNode } from "react";
import { BoksModellContextValue } from "@lib/types/context";

const BoksModellContext = createContext<BoksModellContextValue | undefined>(
  undefined
);

export function useBoksModell() {
  const context = useContext(BoksModellContext);
  if (!context) {
    throw new Error("useBoksModell must be used within a BoksModellProvider");
  }
  return context;
}

interface BoksModellProviderProps {
  children: ReactNode;
}

export function BoksModellProvider({ children }: BoksModellProviderProps) {
  const [showBoks, setShowBoks] = useState(false);

  return (
    <BoksModellContext.Provider value={{ showBoks, setShowBoks }}>
      {children}
    </BoksModellContext.Provider>
  );
}
