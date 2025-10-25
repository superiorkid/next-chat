import { useSocketStore } from "@/providers/socket-store-provider";
import { useEffect, useState } from "react";

export function usePresence(partnerId: string) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  const socket = useSocketStore((store) => store.socket);

  useEffect(() => {
    socket?.emit("get_online_users");

    socket?.on("online_users", (users: string[]) => {
      setIsOnline(users.includes(partnerId));
    });

    socket?.on("user_online", ({ userId }) => {
      if (userId === partnerId) setIsOnline(true);
    });

    socket?.on("user_offline", ({ userId, lastSeen }) => {
      if (userId === partnerId) {
        setIsOnline(false);
        setLastSeen(lastSeen);
      }
    });

    return () => {
      socket?.off("user_online");
      socket?.off("user_offline");
      socket?.off("online_users");
    };
  }, [partnerId, socket]);

  return { isOnline, lastSeen };
}
