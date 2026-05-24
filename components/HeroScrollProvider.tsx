"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSocialScrollDriver } from "@/hooks/useSocialScrollDriver";

const HeroScrollContext = createContext(0);

export function useHeroScrollProgress(): number {
  return useContext(HeroScrollContext);
}

export default function HeroScrollProvider({ children }: { children: ReactNode }) {
  const progress = useSocialScrollDriver(true);

  return (
    <HeroScrollContext.Provider value={progress}>
      {children}
    </HeroScrollContext.Provider>
  );
}
