import { io } from "socket.io-client";

export const createSocket = (token: string) => {
  const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
};
