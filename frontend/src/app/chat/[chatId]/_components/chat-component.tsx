"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/hooks/queries/auth";
import { useMessages } from "@/hooks/queries/chat";
import { groupMessagesByDate } from "@/lib/utils";
import { useSocketStore } from "@/providers/socket-store-provider";
import { Message } from "@/types/global-type";
import { format } from "date-fns";
import { RefObject, useEffect, useRef, useState } from "react";
import ChatHeader from "./chat-header";
import ChatMessage from "./chat-message";
import MessageInput from "./message-input";

interface ChatComponentProps {
  chatId: string;
}

const ChatComponent = ({ chatId }: ChatComponentProps) => {
  const socket = useSocketStore((store) => store.socket);
  const { data, isPending: isMessagesLoading } = useMessages(chatId);
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState<boolean>(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const groupedMessages = groupMessagesByDate(messages);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
      setIsPending(false);
    }
  }, [data]);

  const showLoading = isPending || isMessagesLoading;

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
  }, [chatId, socket, session?.data?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
    textareaRef.current?.focus();
  }, [data, isPending]);

  return (
    <div className="flex flex-col h-dvh">
      <ChatHeader chatId={chatId} />

      <MessagesContainer scrollRef={scrollRef as RefObject<HTMLDivElement>}>
        {showLoading ? (
          <MessagesLoading />
        ) : (
          <MessagesList groupedMessages={groupedMessages} />
        )}
      </MessagesContainer>

      <MessageInputContainer chatId={chatId} />
    </div>
  );
};

interface MessagesContainerProps {
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const MessagesContainer = ({ children, scrollRef }: MessagesContainerProps) => {
  return (
    <div className="flex-1 overflow-hidden mt-4">
      <div ref={scrollRef} className="h-full pr-3.5 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const MessagesLoading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="space-y-2 flex flex-col items-center">
        <Spinner className="size-5" />
        <p className="text-muted-foreground text-sm">Loading Messages...</p>
      </div>
    </div>
  );
};

interface MessagesListProps {
  groupedMessages: Record<string, Message[]>;
}

const MessagesList = ({ groupedMessages }: MessagesListProps) => {
  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <MessageGroup key={date} date={date} messages={msgs} />
      ))}
    </div>
  );
};

interface MessageGroupProps {
  date: string;
  messages: Message[];
}

const MessageGroup = ({ date, messages }: MessageGroupProps) => {
  return (
    <div>
      <DateSeparator date={date} />
      {messages.map((msg, i) => {
        const next = messages[i + 1];
        const showAvatar = !next || next.sender?.id !== msg.sender?.id;

        return (
          <ChatMessage key={msg.id} message={msg} showAvatar={showAvatar} />
        );
      })}
    </div>
  );
};

interface DateSeparatorProps {
  date: string;
}

const DateSeparator = ({ date }: DateSeparatorProps) => {
  return (
    <div className="text-center text-xs text-muted-foreground my-2 sticky top-0 font-medium">
      <span className="bg-background px-2 py-1 rounded-md">
        {format(new Date(date), "EEEE, MMM d yyyy")}
      </span>
    </div>
  );
};

const MessageInputContainer = ({ chatId }: { chatId: string }) => {
  const socket = useSocketStore((store) => store.socket);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    <MessageInput
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
      onKeyDown={handleKeyDown}
      textareaRef={textareaRef}
    />
  );
};

export default ChatComponent;
