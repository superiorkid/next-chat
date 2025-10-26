"use client";

import {
  ConversationStore,
  createConversationStore,
} from "@/stores/conversation-store";
import React, { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ConversationStoreApi = ReturnType<typeof createConversationStore>;

export const ConversationStoreContext = createContext<
  ConversationStoreApi | undefined
>(undefined);

const ConversationStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<ConversationStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createConversationStore();
  }
  return (
    <ConversationStoreContext.Provider value={storeRef.current}>
      {children}
    </ConversationStoreContext.Provider>
  );
};

export const useConversationStore = <T,>(
  selector: (store: ConversationStore) => T
): T => {
  const conversationStoreContext = useContext(ConversationStoreContext);
  if (!conversationStoreContext) {
    throw new Error(
      `useConversationStore must be used within ConversationStoreProvider`
    );
  }
  return useStore(conversationStoreContext, selector);
};

export default ConversationStoreProvider;
