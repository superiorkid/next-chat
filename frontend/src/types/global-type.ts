export enum TokenType {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}

export enum ChatRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
  SYSTEM = "SYSTEM",
}

export enum MessageDeliveryStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
}

export enum CallType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export enum CallStatus {
  ONGOING = "ONGOING",
  MISSED = "MISSED",
  ENDED = "ENDED",
  REJECTED = "REJECTED",
}

// Main Types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  image?: string | null;
  bio?: string | null;
  isOnline: boolean;
  lastSeen?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  sessions?: Session[];
  tokens?: Token[];
  sentMessages?: Message[];
  chatParticipants?: ChatParticipant[];
  messageStatuses?: MessageStatus[];
  callsInitiated?: Call[];
  callsReceived?: CallParticipant[];
}

export interface Token {
  id: string;
  userId: string;
  token: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;

  // Relations
  user?: User;
}

export interface Session {
  id: string;
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  lastActive: Date;

  // Relations
  user?: User;
}

export interface Chat {
  id: string;
  name?: string | null;
  isGroup: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  participants?: ChatParticipant[];
  messages?: Message[];
  calls?: Call[];
}

export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  role: ChatRole;
  joinedAt: Date;
  lastReadMessageId?: string | null;

  // Relations
  chat?: Chat;
  user?: User;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content?: string | null;
  type: MessageType;
  mediaUrl?: string | null;
  replyToId?: string | null;
  createdAt: Date;

  // Relations
  chat?: Chat;
  sender?: User;
  statuses?: MessageStatus[];
  replyTo?: Message | null;
  replies?: Message[];
}

export interface MessageStatus {
  id: string;
  messageId: string;
  userId: string;
  status: MessageDeliveryStatus;
  updatedAt: Date;

  // Relations
  message?: Message;
  user?: User;
}

export interface Call {
  id: string;
  initiatorId: string;
  type: CallType;
  startedAt: Date;
  endedAt?: Date | null;
  status: CallStatus;
  chatId?: string | null;

  // Relations
  initiator?: User;
  participants?: CallParticipant[];
  chat?: Chat | null;
}

export interface CallParticipant {
  id: string;
  callId: string;
  userId: string;
  joinedAt: Date;
  leftAt?: Date | null;
  isMuted: boolean;
  isVideoEnabled: boolean;

  // Relations
  call?: Call;
  user?: User;
}
