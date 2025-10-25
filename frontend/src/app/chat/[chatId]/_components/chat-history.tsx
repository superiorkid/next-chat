"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useMessages } from "@/hooks/queries/chat";
import { groupMessagesByDate } from "@/lib/utils";
import { useSocketStore } from "@/providers/socket-store-provider";
import { Message } from "@/types/global-type";
import { format } from "date-fns";
import { MicIcon, PaperclipIcon, SmileIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";

interface ChatComponentProps {
  chatId: string;
}

const ChatComponent = ({ chatId }: ChatComponentProps) => {
  const socket = useSocketStore((store) => store.socket);
  const { data, isPending } = useMessages(chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const groupedMessages = groupMessagesByDate(messages);

  const [message, setMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (data?.data) {
      setMessages(data.data);
      scrollToBottom();
    }
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
      <ChatHeader />

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
                  <div className="text-center text-xs text-muted-foreground my-2">
                    {format(new Date(date), "EEEE, MMM d yyyy")}
                  </div>
                  {msgs.map((msg, i) => {
                    const prev = msgs[i - 1];
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

      <div className="py-4 px-1 bg-background">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Enter message..."
            className="field-sizing-content max-h-40 min-h-14 resize-none py-1.75 pe-56"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-3 bottom-3">
            <div className="flex items-center space-x-2.5">
              <Button variant="outline" size="icon-sm">
                <SmileIcon />
              </Button>
              <Button variant="outline" size="icon-sm">
                <PaperclipIcon />
              </Button>
              <Button variant="outline" size="icon-sm">
                <MicIcon />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={sendMessage}
                disabled={!message.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
