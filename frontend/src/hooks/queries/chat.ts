import { clientAxios } from "@/lib/axios/client";
import { chatKeys } from "@/lib/query-keys";
import { TApiResponse } from "@/types/api-response-type";
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

export function useMessages() {
  return useQuery({
    queryKey: chatKeys.allPartners(),
    queryFn: async () => {
      const res = await clientAxios.get<TApiResponse<TPartner[]>>("/v1/chats");
      return res.data;
    },
  });
}
