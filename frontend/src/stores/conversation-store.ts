import { createStore } from "zustand/vanilla";

export type Conversation = {
  chatId: string;
  lastMessage: { content: string; createdAt: Date };
};

export type ConversationState = {
  lastMessages: Record<string, Conversation["lastMessage"]>;
};

export type ConversationActions = {
  setLastMessage: (
    chatId: string,
    lastMessage: Conversation["lastMessage"]
  ) => void;
};

export type ConversationStore = ConversationState & ConversationActions;

export const defaultInitState: ConversationState = {
  lastMessages: {},
};

export const createConversationStore = (
  initState: ConversationState = defaultInitState
) => {
  return createStore<ConversationStore>()((set) => ({
    ...initState,
    setLastMessage: (chatId, lastMessage) =>
      set((state) => ({
        lastMessages: {
          ...state.lastMessages,
          [chatId]: lastMessage,
        },
      })),
  }));
};
