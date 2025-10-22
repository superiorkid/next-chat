import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { getErrorInfo } from 'src/lib/get-error-info';
import { MessageStatusRepository } from '../message/message-status.repository';
import { MessageRepository } from '../message/message.repository';
import { UserRepository } from '../user/user.repository';
import { ChatParticipantRepository } from './chat-participant.repository';
import { ChatRepository } from './chat.repository';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private userRepository: UserRepository,
    private chatRepository: ChatRepository,
    private chatParticipantRepository: ChatParticipantRepository,
    private messageRepository: MessageRepository,
    private messageStatusRepository: MessageStatusRepository,
  ) {}

  async startConversation(currentUserId: string, email: string) {
    try {
      const recipient = await this.userRepository.findUnique({
        where: { email },
      });

      if (!recipient) {
        throw new NotFoundException('User not found');
      }

      if (recipient.id === currentUserId) {
        throw new NotFoundException('You cannot chat with yourself');
      }

      const existingChat = await this.chatRepository.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              OR: [{ userId: currentUserId }, { userId: recipient.id }],
            },
          },
        },
        include: { participants: true },
        select: { id: true },
      });

      if (existingChat) {
        return {
          success: true,
          message: 'Existing conversation retrieved successfully',
          data: existingChat,
        };
      }

      const newChat = await this.chatRepository.create({
        data: {
          isGroup: false,
          participants: {
            create: [{ userId: currentUserId }, { userId: recipient.id }],
          },
        },
        include: {
          participants: {
            include: { user: true },
          },
        },
        select: { id: true },
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

    const participant = await this.chatParticipantRepository.findFirst({
      where: { chatId, userId },
    });
    if (!participant) throw new ForbiddenException('Not part of this chat');

    try {
      const messages = await this.messageRepository.findMany({
        where: {
          chatId,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
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

    const participant = await this.chatParticipantRepository.findFirst({
      where: { chatId, userId: senderId },
    });
    if (!participant)
      throw new ForbiddenException('You are not part of this chat.');

    const message = await this.messageRepository.create({
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

    const participants = await this.chatParticipantRepository.findMany({
      where: { chatId },
    });
    await this.messageStatusRepository.createMany({
      data: participants.map((p) => ({
        messageId: message.id,
        userId: p.userId,
        status: p.userId === senderId ? 'READ' : 'SENT',
      })),
    });

    return message;
  }
}
