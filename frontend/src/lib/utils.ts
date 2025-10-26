import { Message } from "@/types/global-type";
import { clsx, type ClassValue } from "clsx";
import { format, isThisWeek, isThisYear, isToday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitial(text: string) {
  return text
    .split(" ")
    .map((n) => n[0])
    .join();
}

export const groupMessagesByDate = (messages: Message[]) => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((msg) => {
    const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
  });

  return groups;
};

export const formatMessageTime = (messageTime: Date | string): string => {
  const date = new Date(messageTime);

  if (isToday(date)) {
    return format(date, "HH:mm a");
  } else if (isThisWeek(date)) {
    return format(date, "EEE");
  } else if (isThisYear(date)) {
    return format(date, "MMM d");
  } else {
    return format(date, "MM/dd/yyyy");
  }
};
