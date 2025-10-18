import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { MessageSquareTextIcon } from "lucide-react";
import React from "react";

const ChatPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 px-6 text-center">
      <Empty className="max-w-md">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareTextIcon strokeWidth={2} className="stroke-primary" />
          </EmptyMedia>
          <EmptyTitle>Select a chat to start messaging</EmptyTitle>
          <EmptyDescription>
            Please choose a chat or create a new message to get started.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default ChatPage;
