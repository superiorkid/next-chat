import { createStore } from "zustand/vanilla";

export type PresenceState = {
  onlineUsers: string[];
  lastSeenMap: Record<string, Date>;
  initialized: boolean;
};

export type PresenceActions = {
  setOnlineUsers: (users: string[]) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string, lastSeen: Date) => void;
};

export type PresenceStore = PresenceState & PresenceActions;

export const defaultInitState: PresenceState = {
  initialized: false,
  onlineUsers: [],
  lastSeenMap: {},
};

export const createPresenceStore = (
  initState: PresenceState = defaultInitState
) => {
  return createStore<PresenceStore>()((set) => ({
    ...initState,
    setOnlineUsers: (users) =>
      set(() => ({ onlineUsers: users, initialized: true })),
    setUserOnline: (userId) =>
      set((state) => ({
        onlineUsers: [...new Set([...state.onlineUsers, userId])],
      })),
    setUserOffline: (userId, lastSeen) =>
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== userId),
        lastSeenMap: { ...state.lastSeenMap, [userId]: lastSeen },
      })),
  }));
};
