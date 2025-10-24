export type TPartner = {
  chatId: string;
  isGroup: boolean;
  name: string;
  image?: string;
  partnerId?: string;
  lastMessage: {
    content: string;
    createdAt: Date;
    senderName: string;
  };
};
