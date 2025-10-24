export const chatKeys = {
  all: ["chats"] as const,
  allPartners: () => [...chatKeys.all, { mode: "partners" }] as const,
};

export const messageKeys = {
  all: ["messages"] as const,
  allWithChatId: (chatId: string) => [...messageKeys.all, { chatId }] as const,
};
