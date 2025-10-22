import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebsocketGateway } from 'src/common/abstracts/websocket.gateway';
import { type AuthenticatedSocket } from 'src/common/types/authenticate-socket.type';
import { PresenceService } from '../presence/presence.service';
import { TokenRepository } from '../user/token.repository';
import { ChatParticipantRepository } from './chat-participant.repository';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway extends WebsocketGateway {
  constructor(
    configService: ConfigService,
    jwtService: JwtService,
    tokenRepository: TokenRepository,
    presenceService: PresenceService,
    private chatService: ChatService,
    private chatParticipantRepository: ChatParticipantRepository,
  ) {
    super(configService, jwtService, tokenRepository, presenceService);
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    await super.handleConnection(socket);

    const userId = socket.user?.sub;
    if (!userId) return;

    const userChats = await this.chatParticipantRepository.findMany({
      where: { userId },
      select: { chatId: true },
    });
    for (const chat of userChats) {
      await socket.join(chat.chatId);
    }
    this.logger.log(`User ${userId} joined ${userChats.length} chat rooms.`);
  }

  @SubscribeMessage('chat:send_message')
  async onSendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() data: { chatId: string; content: string },
  ) {
    const message = await this.chatService.sendMessage({
      senderId: socket.user?.sub as string,
      chatId: data.chatId,
      sendMessageDto: { content: data.content, type: 'TEXT' },
    });

    this.server.to(data.chatId).emit('chat:new_message', message);
  }
}
