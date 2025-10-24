export const chatKeys = {
  all: ["chats"] as const,
  allPartners: () => [...chatKeys.all, { mode: "partners" }] as const,
};
