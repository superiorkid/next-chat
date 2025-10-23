"use client";

import { createSocketStore, SocketStore } from "@/stores/socket-store";
import React, { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type SocketStoreApi = ReturnType<typeof createSocketStore>;

const SocketStoreContext = createContext<SocketStoreApi | undefined>(undefined);

export const SocketStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<SocketStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSocketStore();
  }

  return (
    <SocketStoreContext.Provider value={storeRef.current}>
      {children}
    </SocketStoreContext.Provider>
  );
};

export const useSocketStore = <T,>(selector: (store: SocketStore) => T): T => {
  const socketStoreContext = useContext(SocketStoreContext);
  if (!socketStoreContext) {
    throw new Error(`useSocketStore must be used within SocketStoreProvider`);
  }
  return useStore(socketStoreContext, selector);
};
