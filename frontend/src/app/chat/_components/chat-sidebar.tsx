"use client";

import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useStartConversation } from "@/hooks/queries/chat";
import { EllipsisIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Partners from "./partners";
import { useLogoutMutation } from "@/hooks/queries/auth";
import { useRouter } from "next/navigation";
import { useSocketStore } from "@/providers/socket-store-provider";
import { getQueryClient } from "@/lib/query-client";

const ChatSidebar = () => {
  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-[384px] -translate-x-full sm:translate-x-0">
      <div className="h-screen p-5">
        <div className="border h-full shadow-sm rounded-lg overflow-hidden space-y-1.5">
          <ChatSidebarHeader />
          <div className="px-4">
            <SearchInput />
          </div>
          <Partners />
        </div>
      </div>
    </div>
  );
};

const ChatSidebarHeader = () => {
  return (
    <div className="space-y-5 p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">
          <Link href="/chat">Chats</Link>
        </h3>
        <NewChatDialog />
      </div>
    </div>
  );
};

const SearchInput = () => {
  return (
    <div className="relative">
      <Input className="peer ps-9" placeholder="Search..." type="search" />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <SearchIcon size={16} />
      </div>
    </div>
  );
};

const NewChatDialog = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();
  const disconnect = useSocketStore((store) => store.disconnect);
  const queryClient = getQueryClient();

  const { mutate } = useLogoutMutation({
    onLogoutSuccess: () => {
      disconnect();
      queryClient.clear();
      router.refresh();
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full cursor-pointer"
          >
            <EllipsisIcon strokeWidth={2} />
            <span className="sr-only">chat options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>New chat</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={() => mutate()}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewChatDialogContent
        onNewConversationComplete={() => {
          setOpenDialog(false);
        }}
      />
    </Dialog>
  );
};

const NewChatDialogContent = ({
  onNewConversationComplete,
}: {
  onNewConversationComplete: () => void;
}) => {
  const [email, setEmail] = useState<string>("");

  const { mutate, isPending } = useStartConversation({
    onSuccess: () => {
      onNewConversationComplete();
    },
  });

  return (
    <DialogContent>
      <AlertDialogHeader>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus,
          aperiam!
        </DialogDescription>
      </AlertDialogHeader>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="Find a contact by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FieldDescription>Please enter a valid email</FieldDescription>
      </Field>
      <AlertDialogFooter>
        <Button
          variant="secondary"
          onClick={() => mutate(email)}
          disabled={isPending}
        >
          Find & Start Conversation
        </Button>
      </AlertDialogFooter>
    </DialogContent>
  );
};

export default ChatSidebar;
