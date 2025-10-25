"use client";

import { usePresenceStore } from "@/providers/presence-store-provider";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useEffect } from "react";

const PresenceListener = () => {
  const socket = useSocketStore((store) => store.socket);

  const initialized = usePresenceStore((store) => store.initialized);
  const setOnlineUsers = usePresenceStore((store) => store.setOnlineUsers);
  const setUserOnline = usePresenceStore((store) => store.setUserOnline);
  const setUserOffline = usePresenceStore((store) => store.setUserOffline);

  useEffect(() => {
    if (!socket) return;

    if (!initialized) socket.emit("get_online_users");

    const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);
    const handleUserOnline = ({ userId }: { userId: string }) =>
      setUserOnline(userId);
    const handleUserOffline = ({
      userId,
      lastSeen,
    }: {
      userId: string;
      lastSeen: Date;
    }) => setUserOffline(userId, lastSeen);

    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socket, initialized, setOnlineUsers, setUserOffline, setUserOnline]);

  return null;
};

export default PresenceListener;
