"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePartner } from "@/hooks/queries/chat";
import { cn, getInitial } from "@/lib/utils";
import { usePresenceStore } from "@/providers/presence-store-provider";
import { formatDistance } from "date-fns";
import { EllipsisIcon, GithubIcon, PhoneIcon, VideoIcon } from "lucide-react";

interface ChatHeaderProps {
  chatId: string;
}

const ChatHeader = ({ chatId }: ChatHeaderProps) => {
  const { data: partner, isPending } = usePartner({ chatId });

  const isOnline = usePresenceStore((store) =>
    store.onlineUsers.includes(partner?.data?.partnerId as string)
  );
  const lastSeen = usePresenceStore(
    (store) => store.lastSeenMap[partner?.data?.partnerId as string]
  );

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-5 pr-5">
      <div className="flex gap-2.5">
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage src={partner?.data?.image} />
            <AvatarFallback className="uppercase">
              {getInitial(partner?.data?.name || "unknown")}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-muted-foreground",
              isOnline && "bg-emerald-500"
            )}
          >
            <span className="sr-only">{isOnline ? "Online" : "Offline"}</span>
          </span>
        </div>
        <div className="text-sm space-y-0.5">
          <h1 className="font-semibold capitalize">
            {partner?.data?.name || "Unknown"}
          </h1>
          <p
            className={cn(
              "text-muted-foreground",
              isOnline && "text-emerald-500"
            )}
          >
            {isOnline
              ? "online"
              : `last seen ${formatDistance(
                  new Date(lastSeen ?? (partner?.data?.lastSeen as Date)),
                  new Date(),
                  { addSuffix: true }
                )}`}
          </p>
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
                    <AvatarImage src={partner?.data?.image} />
                    <AvatarFallback className="uppercase">
                      {getInitial(partner?.data?.name || "unknown")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h1 className="font-semibold text-xl">
                      {partner?.data?.name}
                    </h1>
                    <p className="text-sm">
                      Last seen:{" "}
                      <span
                        className={cn(
                          "font-medium text-muted-foreground",
                          isOnline && "text-emerald-600"
                        )}
                      >
                        {isOnline
                          ? "Online"
                          : formatDistance(
                              new Date(
                                lastSeen ?? (partner?.data?.lastSeen as Date)
                              ),
                              new Date(),
                              { addSuffix: true }
                            )}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <div className="py-5 border-b space-y-2">
                    <h3 className="font-medium tracking-tight">About</h3>
                    <p className="text-muted-foreground">
                      I love reading, traveling and discovering new things. You
                      need to be happy in life.
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
                    <h3 className="font-medium tracking-tight">Social Links</h3>
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
  );
};

export default ChatHeader;
