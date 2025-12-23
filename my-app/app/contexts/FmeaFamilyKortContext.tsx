'use client';

import { createContext, useContext, useState, type ReactNode } from "react";
import { FmeaFamilyKortContextValue } from "@lib/types/context";

const FmeaFamilyKortContext = createContext<
  FmeaFamilyKortContextValue | undefined
>(undefined);

export function useFmeaFamilyKort() {
  const context = useContext(FmeaFamilyKortContext);
  if (!context) {
    throw new Error(
      "useFmeaFamilyKort must be used within a FmeaFamilyKortProvider"
    );
  }
  return context;
}

interface FmeaFamilyKortProviderProps {
  children: ReactNode;
}

export function FmeaFamilyKortProvider({
  children,
}: FmeaFamilyKortProviderProps) {
  const [showFmeaFamilyKort, setShowFmeaFamilyKort] = useState(false);

  return (
    <FmeaFamilyKortContext.Provider
      value={{ showFmeaFamilyKort, setShowFmeaFamilyKort }}
    >
      {children}
    </FmeaFamilyKortContext.Provider>
  );
}
