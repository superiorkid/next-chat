import { createServerAxios } from "@/lib/axios/server";
import { getQueryClient } from "@/lib/query-client";
import { chatKeys, messageKeys } from "@/lib/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ChatComponent from "./_components/chat-history";
import { TApiResponse } from "@/types/api-response-type";
import { TPartner } from "@/types/partner-type";

interface ChatHistoryPageProps {
  params: Promise<{ chatId: string }>;
}

const ChatHistoryPage = async ({ params }: ChatHistoryPageProps) => {
  const { chatId } = await params;

  const httpClient = await createServerAxios();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: messageKeys.allWithChatId(chatId),
      queryFn: async () => {
        const res = await httpClient.get(`/v1/chats/${chatId}/messages`);
        return res.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: chatKeys.detailPartner(chatId),
      queryFn: async () => {
        const res = await httpClient.get<TApiResponse<TPartner>>(
          `/v1/chats/${chatId}`
        );
        return res.data;
      },
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-screen pr-5 grid grid-rows-[auto_1fr_auto]">
        <ChatComponent chatId={chatId} />
      </div>
    </HydrationBoundary>
  );
};

export default ChatHistoryPage;
