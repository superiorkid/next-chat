import { clientAxios } from "@/lib/axios/client";
import { chatKeys, messageKeys } from "@/lib/query-keys";
import { TApiResponse } from "@/types/api-response-type";
import { Message } from "@/types/global-type";
import { TPartner } from "@/types/partner-type";
import { useQuery } from "@tanstack/react-query";

export function usePartners() {
  return useQuery({
    queryKey: chatKeys.allPartners(),
    queryFn: async () => {
      const res = await clientAxios.get<TApiResponse<TPartner[]>>("/v1/chats");
      return res.data;
    },
  });
}

export function usePartner(params: { chatId: string }) {
  return useQuery({
    queryKey: chatKeys.detailPartner(params.chatId),
    queryFn: async () => {
      const res = await clientAxios.get<TApiResponse<TPartner>>(
        `/v1/chats/${params.chatId}`
      );
      return res.data;
    },
    enabled: !!params.chatId,
  });
}

export function useMessages(chatId: string) {
  return useQuery({
    queryKey: messageKeys.allWithChatId(chatId),
    queryFn: async () => {
      const res = await clientAxios.get<TApiResponse<Message[]>>(
        `/v1/chats/${chatId}/messages`
      );
      return res.data;
    },
    enabled: !!chatId,
  });
}
