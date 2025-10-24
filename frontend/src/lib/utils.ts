import { clsx, type ClassValue } from "clsx";
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
