import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { getErrorInfo } from 'src/lib/get-error-info';
import { DatabaseService } from 'src/shared/database/database.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private databaseService: DatabaseService) {}

  async getChatPartners(userId: string) {
    try {
      const participants = await this.databaseService.chatParticipant.findMany({
        where: {
          userId,
        },
        include: {
          chat: {
            include: {
              participants: {
                where: { NOT: { userId } },
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      isOnline: true,
                      lastSeen: true,
                    },
                  },
                },
              },
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: {
                  sender: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const chats = participants.map((p) => {
        const chat = p.chat;
        const lastMessage = chat.messages[0] || null;

        // for dm: get partner info
        const partner =
          !chat.isGroup && chat.participants.length > 0
            ? chat.participants[0].user
            : null;

        return {
          chatId: chat.id,
          isGroup: chat.isGroup,
          name: chat.isGroup ? chat.name : partner?.name,
          image: chat.isGroup ? chat.image : partner?.image,
          partnerId: partner?.id,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderName: lastMessage.sender.name,
              }
            : null,
        };
      });

      chats.sort(
        (a, b) =>
          (b.lastMessage?.createdAt?.getTime() || 0) -
          (a.lastMessage?.createdAt?.getTime() || 0),
      );

      return {
        success: true,
        message: 'Chats retrieved successfully',
        data: chats,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          userId,
          id: 'start-conversation-error',
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to start conversation',
      );

      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving chats. Please try again later.',
      );
    }
  }

  async startConversation(currentUserId: string, email: string) {
    try {
      const recipient = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!recipient) {
        throw new NotFoundException('User not found');
      }

      if (recipient.id === currentUserId) {
        throw new NotFoundException('You cannot chat with yourself');
      }

      const existingChat = await this.databaseService.chat.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              OR: [{ userId: currentUserId }, { userId: recipient.id }],
            },
          },
        },
        select: { id: true, participants: true },
      });

      if (existingChat) {
        return {
          success: true,
          message: 'Existing conversation retrieved successfully',
          data: existingChat,
        };
      }

      const newChat = await this.databaseService.chat.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId: currentUserId }, { userId: recipient.id }],
          },
        },
        select: { id: true, participants: { include: { user: true } } },
      });

      return {
        success: true,
        message: 'Conversation started successfully',
        data: newChat,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          id: 'start-conversation-error',
          userId: currentUserId,
          email: email,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to start conversation',
      );
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unable to start conversation at this time',
      );
    }
  }

  async getMessages(params: { chatId: string; userId: string }) {
    const { chatId, userId } = params;

    const participant = await this.databaseService.chatParticipant.findFirst({
      where: { chatId, userId },
    });
    if (!participant) throw new ForbiddenException('Not part of this chat');

    try {
      const messages = await this.databaseService.message.findMany({
        where: {
          chatId,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true, email: true },
          },
          chat: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return {
        success: true,
        message: '',
        data: messages,
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);
      this.logger.error(
        {
          id: 'get-messages-error',
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to get messages',
      );
      throw new InternalServerErrorException('Failed to get messages');
    }
  }

  async sendMessage(params: {
    senderId: string;
    chatId: string;
    sendMessageDto: SendMessageDto;
  }) {
    const { chatId, sendMessageDto, senderId } = params;

    const participant = await this.databaseService.chatParticipant.findFirst({
      where: { chatId, userId: senderId },
    });
    if (!participant)
      throw new ForbiddenException('You are not part of this chat.');

    const message = await this.databaseService.message.create({
      data: {
        chatId,
        senderId,
        content: sendMessageDto.content,
        type: sendMessageDto.type ?? 'TEXT',
        replyToId: sendMessageDto.replyToId,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    const participants = await this.databaseService.chatParticipant.findMany({
      where: { chatId },
    });
    await this.databaseService.messageStatus.createMany({
      data: participants.map((p) => ({
        messageId: message.id,
        userId: p.userId,
        status: p.userId === senderId ? 'READ' : 'SENT',
      })),
    });

    return message;
  }
}
