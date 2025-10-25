"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MicIcon, PaperclipIcon, SmileIcon } from "lucide-react";
import React from "react";

interface MessageInputProps {
  message: string;
  setMessage: (newMessage: string) => void;
  sendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const MessageInput = ({
  message,
  setMessage,
  sendMessage,
  onKeyDown,
  textareaRef,
}: MessageInputProps) => {
  return (
    <div className="py-4 px-1 bg-background">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Enter message..."
          className="field-sizing-content max-h-40 min-h-14 resize-none py-1.75 pe-56"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
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
  );
};

export default MessageInput;
