import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

const ConversationCard = () => {
  return (
    <div className="text-sm px-5 py-4 hover:bg-zinc-200/70 cursor-pointer border-b last:border-b-0 relative">
      <Link href="/chat/conversation-id" className="flex gap-2.5">
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="Kelly King" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
          <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500">
            <span className="sr-only">Online</span>
          </span>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center">
            <h3 className="font-medium line-clamp-1">Jacquenetta Slowgrave</h3>
            <span className="text-xs font-medium text-muted-foreground ml-auto text-nowrap">
              10 minutes
            </span>
          </div>
          <p className="line-clamp-1 text-muted-foreground">
            I know how important this file is to you. You can trust me ;) I know
            how important this file is to you. You can trust me ;) know how
            important this file is to you. You can trust me ;)
          </p>
        </div>
        <Badge className="size-6 rounded-full absolute top-1/2 -translate-y-1/2 right-3">
          3
        </Badge>
      </Link>
    </div>
  );
};

export default ConversationCard;
