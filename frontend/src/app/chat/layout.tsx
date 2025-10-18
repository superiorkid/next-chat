import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, SearchIcon } from "lucide-react";
import React from "react";
import ConversationCard from "./_components/conversation-card";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div>
      <div className="fixed left-0 top-0 z-40 h-screen w-[384px] -translate-x-full sm:translate-x-0">
        <div className="h-screen p-5">
          <div className="border h-full shadow-sm rounded-lg overflow-hidden">
            <div className="space-y-5 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Chats</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full cursor-pointer"
                    >
                      <PlusIcon strokeWidth={2} />
                      <span className="sr-only"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>New chat</DropdownMenuItem>
                    <DropdownMenuItem>Create group</DropdownMenuItem>
                    <DropdownMenuItem>Add contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <Input
                  className="peer ps-9 border-zinc-100 rounded-sm"
                  placeholder="Search..."
                  type="text"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
              </div>
            </div>
            <ScrollArea className="h-full divide-y">
              {Array.from({ length: 35 }).map((_, index) => (
                <ConversationCard key={index} />
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="sm:ml-[395px] overflow-hidden">{children}</div>
    </div>
  );
};

export default ChatLayout;
