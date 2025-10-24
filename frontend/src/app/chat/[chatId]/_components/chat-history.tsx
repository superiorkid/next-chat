"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useMessages } from "@/hooks/queries/chat";
import { Message } from "@/types/global-type";
import { MicIcon, PaperclipIcon, SmileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import { useSocketStore } from "@/providers/socket-store-provider";

interface ChatComponentProps {
  chatId: string;
}

const ChatComponent = ({ chatId }: ChatComponentProps) => {
  const socket = useSocketStore((store) => store.socket);
  const { data, isPending } = useMessages(chatId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isPending) return <p>Loading messages...</p>;

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader />

      <div className="flex-1 overflow-hidden mt-4">
        <ScrollArea className="h-full pr-3.5" ref={scrollRef}>
          <div className="space-y-1 p-4">
            {(messages || []).map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="py-4 border-t px-1 bg-background">
        <div className="relative">
          <Textarea
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
