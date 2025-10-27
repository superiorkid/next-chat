import { clientAxios } from "@/lib/axios/client";
import { chatKeys, messageKeys } from "@/lib/query-keys";
import { TApiResponse } from "@/types/api-response-type";
import { Chat, Message } from "@/types/global-type";
import { TPartner } from "@/types/partner-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useStartConversation(props?: { onSuccess?: () => void }) {
  const { onSuccess } = props || {};

  return useMutation({
    mutationFn: async (email: string) => {
      const res = await clientAxios.post<TApiResponse<Chat>>(
        "/v1/chats/start",
        { email }
      );
      return res.data;
    },
    onError: () => {
      toast.error("Failed to start conversation", {
        description: "Please check the email and try again.",
      });
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: chatKeys.all });
      toast.success("Conversation started", {
        description: "You have successfully started a new chat.",
      });
      onSuccess?.();
      window.location.href = `/chat/${data.data?.id}`;
    },
  });
}
