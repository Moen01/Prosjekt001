'use client';

import { ReactNode } from "react";
import { BoksModellProvider } from "./contexts/BoksModellContext";
import { FmeaFamilyKortProvider } from "./contexts/FmeaFamilyKortContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BoksModellProvider>
      <FmeaFamilyKortProvider>{children}</FmeaFamilyKortProvider>
    </BoksModellProvider>
  );
}
