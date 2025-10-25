"use client";

import { createPresenceStore, PresenceStore } from "@/stores/presence-store";
import React, { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type PresenceStoreApi = ReturnType<typeof createPresenceStore>;

export const PresenceStoreContext = createContext<PresenceStoreApi | undefined>(
  undefined
);

const PresenceStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<PresenceStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPresenceStore();
  }

  return (
    <PresenceStoreContext.Provider value={storeRef.current}>
      {children}
    </PresenceStoreContext.Provider>
  );
};

export const usePresenceStore = <T,>(
  selector: (store: PresenceStore) => T
): T => {
  const presenceStoreContext = useContext(PresenceStoreContext);
  if (!presenceStoreContext) {
    throw new Error(
      `usePresenceStore must be used within PresenceStoreProvider`
    );
  }
  return useStore(presenceStoreContext, selector);
};

export default PresenceStoreProvider;
