import { createSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { createStore } from "zustand/vanilla";

export type SocketState = {
  socket: Socket | null;
};

export type SocketActions = {
  connect: () => void;
  disconnect: () => void;
};

export type SocketStore = SocketState & SocketActions;

export const defaultSocketState: SocketState = {
  socket: null,
};

export const createSocketStore = (
  initState: SocketState = defaultSocketState
) => {
  return createStore<SocketStore>()((set, get) => ({
    ...initState,
    connect: () => {
      if (get().socket?.connect) return; // avoid duplicate connection

      const socket = createSocket();
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
      });

      set({ socket });
    },
    disconnect: () => {
      const socket = get().socket;
      if (socket) {
        socket.disconnect();
        console.log("Socket manually disconnected");
      }
      set({ socket: null });
    },
  }));
};
