import { TLoginSchema } from "@/app/auth/sign-in/login-schema";
import { TSignUpSchema } from "@/app/auth/sign-up/sign-up-schema";
import { clientAxios } from "@/lib/axios/client";
import { User } from "@/types/global-type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TApiResponse } from "../../types/api-response-type";

export function useLoginMutation(props?: { onLoginSuccess: () => void }) {
  const { onLoginSuccess } = props || {};

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
    onSuccess() {
      toast.success("Login successful", {
        description: "You have been logged in successfully.",
      });
      onLoginSuccess?.();
    },
  });
}

export function useRegisterMutation(props?: { onRegisterSuccess: () => void }) {
  const { onRegisterSuccess } = props || {};

  return useMutation({
    mutationFn: async (data: TSignUpSchema) => {
      const res = await clientAxios.post<TApiResponse>(
        "/v1/auth/register",
        data
      );
      return res.data;
    },
    onError(error: AxiosError) {
      toast.error("Register failed", {
        description:
          (error.response?.data as { message: string }).message ||
          "Please check your credentials and try again.",
      });
    },
    onSuccess() {
      toast.success("Register successful", {
        description: "You have been register successfully.",
      });
      onRegisterSuccess?.();
    },
  });
}

export function useLogoutMutation(props?: { onLogoutSuccess: () => void }) {
  const { onLogoutSuccess } = props || {};

  return useMutation({
    mutationFn: async () => {
      const res = await clientAxios.delete("/v1/auth/logout");
      return res.data;
    },
    onError(error: AxiosError) {
      toast.error("Logout failed", {
        description:
          ((error.response?.data as { message?: string }).message ??
            "An unexpected error occurred.") +
          " Please try again or contact support if the issue persists.",
      });
    },
    onSuccess() {
      toast.success("Logout successful", {
        description: "You have been logged out successfully.",
      });
      onLogoutSuccess?.();
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await clientAxios.get<TApiResponse<User>>("/v1/auth/session");
      return res.data;
    },
  });
}
