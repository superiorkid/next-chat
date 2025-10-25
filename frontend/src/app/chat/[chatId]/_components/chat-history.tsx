"use client";

import { Spinner } from "@/components/ui/spinner";
import { useMessages } from "@/hooks/queries/chat";
import { groupMessagesByDate } from "@/lib/utils";
import { useSocketStore } from "@/providers/socket-store-provider";
import { Message } from "@/types/global-type";
import { format } from "date-fns";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import MessageInput from "./message-input";

interface ChatComponentProps {
  chatId: string;
}

const ChatComponent = ({ chatId }: ChatComponentProps) => {
  const socket = useSocketStore((store) => store.socket);
  const { data } = useMessages(chatId);
  const [isPending, setIsPending] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const groupedMessages = groupMessagesByDate(messages);

  const [message, setMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    setIsPending(true);
    if (data?.data) {
      setMessages(data.data);
      scrollToBottom();
    }
    setIsPending(false);
  }, [data]);

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatId === chatId) {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      }
    };

    socket?.on("chat:new_message", handleNewMessage);
    return () => {
      socket?.off("chat:new_message", handleNewMessage);
    };
  }, [chatId, socket]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      console.log(scrollRef.current.scrollTop);
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket?.emit("chat:send_message", {
      chatId,
      content: message.trim(),
    });
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader chatId={chatId} />

      <div className="flex-1 overflow-hidden mt-4">
        <div ref={scrollRef} className="h-full pr-3.5 overflow-y-auto">
          {isPending ? (
            <div className="flex justify-center items-center h-full">
              <div className="space-y-2 flex flex-col items-center">
                <Spinner className="size-5" />
                <p className="text-muted-foreground text-sm">
                  Loading Messages...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="text-center text-xs text-muted-foreground my-2 sticky top-0 font-medium">
                    <span className="bg-background px-2 py-1 rounded-md">
                      {format(new Date(date), "EEEE, MMM d yyyy")}
                    </span>
                  </div>
                  {msgs.map((msg, i) => {
                    const next = msgs[i + 1];
                    const showAvatar =
                      !next || next.sender?.id !== msg.sender?.id;

                    return (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        showAvatar={showAvatar}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        onKeyDown={handleKeyDown}
        textareaRef={textareaRef}
      />
    </div>
  );
};

export default ChatComponent;
