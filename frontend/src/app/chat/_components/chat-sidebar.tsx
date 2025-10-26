import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "lucide-react";
import Partners from "./partners";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChatSidebar = () => {
  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-[384px] -translate-x-full sm:translate-x-0">
      <div className="h-screen p-5">
        <div className="border h-full shadow-sm rounded-lg overflow-hidden">
          <div className="space-y-5 p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                <Link href="/chat">Chats</Link>
              </h3>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
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
                    <DialogTrigger asChild>
                      <DropdownMenuItem>New chat</DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem>Create group</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Accusamus, aperiam!
                    </DialogDescription>
                  </DialogHeader>
                  <Input placeholder="Enter destination email" />
                  <DialogFooter>
                    <Button variant="secondary">
                      Find & Start Conversation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
          <Partners />
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
