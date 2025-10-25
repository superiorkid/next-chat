import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/queries/auth";
import { cn, getInitial } from "@/lib/utils";
import { Message } from "@/types/global-type";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { data: session } = useSession();

  const isMe = message.sender?.email === session?.data?.email;

  return (
    <div className={cn("flex gap-3 mb-1", isMe && "flex-row-reverse")}>
      {!isMe && (
        <Avatar className="size-8">
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
              "flex gap-4 items-center rounded-lg px-4 py-2 rounded-bl-none bg-zinc-100",
              isMe && "bg-green-200/40 text-foreground-br-none"
            )}
          >
            <p className="text-sm">{message.content}</p>
            <div
              className={cn(
                "text-xs mt-1 text-muted-foreground font-medium text-nowrap self-end"
              )}
            >
              {format(new Date(message.createdAt), "HH:mm a")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
