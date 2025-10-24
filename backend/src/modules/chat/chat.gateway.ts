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
import { ChatService } from './chat.service';
import { DatabaseService } from 'src/shared/database/database.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway extends WebsocketGateway {
  constructor(
    configService: ConfigService,
    jwtService: JwtService,
    presenceService: PresenceService,
    databaseService: DatabaseService,
    private chatService: ChatService,
  ) {
    super(configService, jwtService, presenceService, databaseService);
  }

  async handleConnection(socket: AuthenticatedSocket): Promise<void> {
    await super.handleConnection(socket);

    const userId = socket.user?.sub;
    if (!userId) return;

    const userChats = await this.databaseService.chatParticipant.findMany({
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
