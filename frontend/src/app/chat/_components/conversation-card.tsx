import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitial } from "@/lib/utils";
import { TPartner } from "@/types/partner-type";
import { formatDistance } from "date-fns";
import Link from "next/link";

interface ConversationCardProps {
  partner: TPartner;
}

const ConversationCard = ({ partner }: ConversationCardProps) => {
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
          <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500">
            <span className="sr-only">Online</span>
          </span>
        </div>
        <div className="space-y-0.5 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-medium line-clamp-1 capitalize">
              {partner.name}
            </h3>
            <span className="text-xs font-medium text-muted-foreground text-nowrap">
              {formatDistance(
                new Date(partner.lastMessage.createdAt),
                new Date(),
                { addSuffix: true }
              )}
            </span>
          </div>
          <p className="line-clamp-1 text-muted-foreground">
            {partner.lastMessage.content}
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
