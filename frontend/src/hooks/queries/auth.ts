import { TLoginSchema } from "@/app/auth/sign-in/login-schema";
import { clientAxios } from "@/lib/axios/client";
import { createSocket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TApiResponse } from "../../../types/api-response-type";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: TLoginSchema) => {
      const res = await clientAxios.post<
        TApiResponse<{ access_token: string }>
      >("/v1/auth/login", data);
      return res.data;
    },
    onError(error: AxiosError) {
      toast.error("Login failed", {
        description:
          (error.response?.data as { message: string }).message ||
          "Please check your credentials and try again.",
      });
    },
    onSuccess(data) {
      const token = data.data?.access_token;
      console.log("token", token);
      const socket = createSocket(token || "");

      socket.on("connect", () => {
        console.log("✅ WebSocket connected:", socket.id);
        toast.success("Login successful", {
          description: "You are now online!",
        });
      });
    },
  });
}
