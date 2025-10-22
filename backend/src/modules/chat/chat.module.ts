import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { PresenceModule } from '../presence/presence.module';
import { UserModule } from '../user/user.module';
import { ChatParticipantRepository } from './chat-participant.repository';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [UserModule, MessageModule, PresenceModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatParticipantRepository,
    ChatRepository,
    ChatGateway,
  ],
  exports: [ChatParticipantRepository, ChatRepository],
})
export class ChatModule {}
