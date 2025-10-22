import { io } from "socket.io-client";

export const createSocket = (token: string) => {
  console.log("token from socket", token);
  const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
    transports: ["websocket"],
    extraHeaders: { Authorization: `Bearer ${token}` },
  });

  return socket;
};
