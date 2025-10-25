import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/queries/auth";
import { cn, getInitial } from "@/lib/utils";
import { Message } from "@/types/global-type";
import { format } from "date-fns";
import { CheckCheckIcon } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

const ChatMessage = ({ message, showAvatar = true }: ChatMessageProps) => {
  const { data: session } = useSession();
  const isMe = message.sender?.email === session?.data?.email;

  return (
    <div
      className={cn(
        "flex gap-2 mb-1",
        isMe && "flex-row-reverse",
        !isMe && !showAvatar && "ml-11"
      )}
    >
      {!isMe && showAvatar && (
        <Avatar className="size-8 self-end">
          <AvatarImage
            src={message.sender?.image as string}
            alt={message.sender?.name}
          />
          <AvatarFallback className="uppercase">
            {getInitial(message.sender?.name as string)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col items-start max-w-[70%]",
          isMe && "items-end"
        )}
      >
        {message.content && (
          <div
            className={cn(
              "flex gap-4 items-center rounded-lg px-4 py-2 bg-zinc-100",
              isMe && "bg-green-200/40"
            )}
          >
            <p className="text-sm whitespace-pre-line">{message.content}</p>
            <div className="text-xs mt-1 text-muted-foreground font-medium text-nowrap self-end flex items-center gap-1.5">
              <span>{format(new Date(message.createdAt), "HH:mm a")}</span>
              <CheckCheckIcon size={17} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
