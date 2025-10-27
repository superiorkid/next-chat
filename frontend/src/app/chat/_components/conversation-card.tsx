"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatMessageTime, getInitial } from "@/lib/utils";
import { useConversationStore } from "@/providers/conversation-store-provider";
import { usePresenceStore } from "@/providers/presence-store-provider";
import { TPartner } from "@/types/partner-type";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";

interface ConversationCardProps {
  partner: TPartner;
}

const ConversationCard = ({ partner }: ConversationCardProps) => {
  const lastMessage = useConversationStore(
    (store) => store.lastMessages[partner.chatId]
  );

  const isOnline = usePresenceStore((store) =>
    store.onlineUsers.includes(partner.partnerId as string)
  );

  const messageContent =
    lastMessage?.content || partner.lastMessage?.content || "";
  const messageTime =
    lastMessage?.createdAt || partner.lastMessage?.createdAt || new Date();

  const hasMessages = messageContent.length > 0;
  const isNewConversation = !hasMessages;

  return (
    <div className="text-sm px-5 py-4 hover:bg-zinc-200/70 cursor-pointer border-b last:border-b-0 relative">
      <Link href={`/chat/${partner.chatId}`} className="flex gap-2.5">
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage src={partner.image} alt="Kelly King" />
            <AvatarFallback className="uppercase">
              {getInitial(partner.name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-muted-foreground",
              isOnline && "bg-emerald-500"
            )}
          >
            <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
          </span>
        </div>

        <div className="space-y-0.5 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-medium line-clamp-1 capitalize">
              {partner.name}
            </h3>
            {!isNewConversation && (
              <span className="text-xs font-medium text-muted-foreground text-nowrap">
                {formatMessageTime(messageTime)}
              </span>
            )}
          </div>

          {isNewConversation ? (
            <div className="flex items-center justify-between w-full">
              <p className="text-xs text-muted-foreground italic">
                No messages yet
              </p>
              <ChevronRightIcon size={16} className="text-muted-foreground" />
            </div>
          ) : (
            <p className="line-clamp-1 text-muted-foreground">
              {messageContent}
            </p>
          )}
        </div>

        {!isNewConversation && (
          <Badge className="size-6 rounded-full absolute top-1/2 -translate-y-1/2 right-3">
            3
          </Badge>
        )}
      </Link>
    </div>
  );
};

export default ConversationCard;
