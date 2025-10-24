"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { usePartners } from "@/hooks/queries/chat";
import { AlertTriangle } from "lucide-react";
import ConversationCard from "./conversation-card";

const Partners = () => {
  const { data: partners, isPending, isError, error, refetch } = usePartners();

  if (isPending) {
    return (
      <div className="flex flex-col items-center space-y-1.5 mt-12">
        <Spinner className="size-5" />
        <p className="text-sm font-medium text-muted-foreground">
          Load Conversations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center space-y-2 mt-8 px-4 text-center">
        <div className="rounded-full bg-destructive/10 p-2">
          <AlertTriangle className="size-4 text-destructive" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Failed to load</p>
          <p className="text-xs text-muted-foreground">
            {error?.message || "Please try refreshing"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="h-7 text-xs"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full divide-y">
      {(partners?.data || []).map((partner, index) => (
        <ConversationCard key={index} partner={partner} />
      ))}
    </ScrollArea>
  );
};

export default Partners;
