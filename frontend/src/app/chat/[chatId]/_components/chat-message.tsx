import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/queries/auth";
import { getInitial } from "@/lib/utils";
import { Message } from "@/types/global-type";
import { formatDistance } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const { data: session } = useSession();

  const isMe = message.sender?.email === session?.data?.email;

  return (
    <div className={`flex gap-3 mb-6 ${isMe ? "flex-row-reverse" : ""}`}>
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
        className={`flex flex-col ${
          isMe ? "items-end" : "items-start"
        } max-w-[70%]`}
      >
        {message.content && (
          <div
            className={`rounded-lg px-4 py-2 ${
              isMe
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-900 rounded-bl-none"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div
              className={`text-xs mt-1 ${
                isMe ? "text-blue-100" : "text-gray-500"
              }`}
            >
              {formatDistance(new Date(message.createdAt), new Date(), {
                addSuffix: true,
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
