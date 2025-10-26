"use client";

import { useConversationStore } from "@/providers/conversation-store-provider";
import { useSocketStore } from "@/providers/socket-store-provider";
import { Message } from "@/types/global-type";
import { useEffect } from "react";

const ConversationListener = () => {
  const socket = useSocketStore((store) => store.socket);
  const setLastMessage = useConversationStore((store) => store.setLastMessage);

  useEffect(() => {
    if (!socket) return;
    socket.on("chat:new_message", (message: Message) => {
      setLastMessage(message.chatId, {
        content: message.content || "",
        createdAt: message.createdAt,
      });
    });

    return () => {
      socket.off("chat:new_message");
    };
  }, [socket, setLastMessage]);

  return null;
};

export default ConversationListener;
