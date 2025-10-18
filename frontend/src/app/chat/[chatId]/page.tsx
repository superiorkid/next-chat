import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  EllipsisIcon,
  GithubIcon,
  MicIcon,
  PaperclipIcon,
  PhoneIcon,
  SmileIcon,
  VideoIcon,
} from "lucide-react";
import ChatComponent from "./_components/chat-history";

const ChatHistoryPage = () => {
  return (
    <div className="h-screen pr-5 grid grid-rows-[auto_1fr_auto]">
      <div className="flex justify-between items-center mt-5 pr-5">
        <div className="flex gap-2.5">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-emerald-500">
              <span className="sr-only">Online</span>
            </span>
          </div>
          <div className="text-sm space-y-0.5">
            <h1 className="font-semibold">Jacquenetta Slowgrave</h1>
            <p className="text-emerald-500">online</p>
          </div>
        </div>
        <div className="space-x-3 flex items-center">
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-sm cursor-pointer"
          >
            <VideoIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-sm cursor-pointer"
          >
            <PhoneIcon />
          </Button>

          <Sheet>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-sm cursor-pointer"
                >
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <SheetTrigger asChild>
                  <DropdownMenuItem>View profile</DropdownMenuItem>
                </SheetTrigger>
                <DropdownMenuItem>Add to archive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Block</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-2xl">Profile</SheetTitle>
                </SheetHeader>

                <div className="px-5 space-y-8">
                  <div className="flex items-center flex-col space-y-4">
                    <Avatar className="size-24">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h1 className="font-semibold text-xl">
                        Jacquenetta Slowgrave
                      </h1>
                      <p className="text-sm">
                        Last seen:{" "}
                        <span className="text-emerald-600 font-medium">
                          Online
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="py-5 border-b space-y-2">
                      <h3 className="font-medium tracking-tight">About</h3>
                      <p className="text-muted-foreground">
                        I love reading, traveling and discovering new things.
                        You need to be happy in life.
                      </p>
                    </div>
                    <div className="py-5 border-b space-y-2">
                      <h3 className="font-medium tracking-tight">Phone</h3>
                      <p className="text-muted-foreground">536-159-0405</p>
                    </div>
                    <div className="py-5 border-b space-y-2">
                      <h3 className="font-medium tracking-tight">Country</h3>
                      <p className="text-muted-foreground">China</p>
                    </div>
                    <div className="py-5 border-b space-y-2">
                      <h3 className="font-medium tracking-tight">Website</h3>
                      <p className="text-muted-foreground">
                        https://laborasyon.com
                      </p>
                    </div>
                    <div className="py-5 space-y-2">
                      <h3 className="font-medium tracking-tight">
                        Social Links
                      </h3>
                      <div className="flex space-x-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Button
                            key={index}
                            size="icon"
                            variant="outline"
                            className="rounded-full size-9"
                          >
                            <GithubIcon strokeWidth={2} />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </DropdownMenu>
          </Sheet>
        </div>
      </div>

      <div className="overflow-hidden mt-4">
        <ScrollArea className="h-full pr-3.5">
          <ChatComponent />
        </ScrollArea>
      </div>

      <div className="py-4 border-t px-1">
        <div className="relative">
          <Textarea
            placeholder="Enter message..."
            className="field-sizing-content max-h-29.5 min-h-14 resize-none py-1.75 pe-56"
          />
          <div className="absolute right-3 bottom-3">
            <div className="flex items-center space-x-2.5">
              <Button variant="outline" size="icon-sm">
                <SmileIcon />
              </Button>
              <Button variant="outline" size="icon-sm">
                <PaperclipIcon />
              </Button>
              <Button variant="outline" size="icon-sm">
                <MicIcon />
              </Button>
              <Button variant="outline" size="sm">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPage;
