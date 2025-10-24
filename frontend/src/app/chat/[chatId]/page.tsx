import { createServerAxios } from "@/lib/axios/server";
import { getQueryClient } from "@/lib/query-client";
import { messageKeys } from "@/lib/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ChatComponent from "./_components/chat-history";

interface ChatHistoryPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatHistoryPage = async ({ params }: ChatHistoryPageProps) => {
  const { chatId } = await params;

  const httpClient = await createServerAxios();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: messageKeys.allWithChatId(chatId),
    queryFn: async () => {
      const res = await httpClient.get(`/v1/chats/${chatId}/messages`);
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-screen pr-5 grid grid-rows-[auto_1fr_auto]">
        <ChatComponent chatId={chatId} />
      </div>
    </HydrationBoundary>
  );
};

export default ChatHistoryPage;
