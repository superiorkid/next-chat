import { io } from "socket.io-client";

export const createSocket = () => {
  const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });

  return socket;
};
