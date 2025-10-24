"use client";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/hooks/queries/auth";
import { getQueryClient } from "@/lib/query-client";
import { useSocketStore } from "@/providers/socket-store-provider";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const disconnect = useSocketStore((store) => store.disconnect);
  const queryClient = getQueryClient();

  const { mutate } = useLogoutMutation({
    onLogoutSuccess: () => {
      disconnect();
      queryClient.clear();
      router.push("/");
    },
  });

  return <Button onClick={() => mutate()}>Log out</Button>;
};

export default LogoutButton;
