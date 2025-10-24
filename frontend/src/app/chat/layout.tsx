import { createServerAxios } from "@/lib/axios/server";
import { getQueryClient } from "@/lib/query-client";
import { chatKeys } from "@/lib/query-keys";
import { TApiResponse } from "@/types/api-response-type";
import { TPartner } from "@/types/partner-type";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import ChatSidebar from "./_components/chat-sidebar";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = async ({ children }: ChatLayoutProps) => {
  const httpClient = await createServerAxios();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: chatKeys.allPartners(),
    queryFn: async () => {
      const res = await httpClient.get<TApiResponse<TPartner[]>>("/v1/chats");
      return res.data;
    },
  });

  console.log(
    "Auth header:",
    httpClient.defaults.headers.common["Authorization"]
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <ChatSidebar />
        <div className="sm:ml-[395px] overflow-hidden">{children}</div>
      </div>
    </HydrationBoundary>
  );
};

export default ChatLayout;
