export type TPartner = {
  chatId: string;
  isGroup: boolean;
  name: string;
  image?: string;
  partnerId?: string;
  isOnline?: boolean;
  lastSeen?: Date;
  lastMessage: {
    content: string;
    createdAt: Date;
    senderName: string;
  };
};
