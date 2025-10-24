import { Module } from '@nestjs/common';
import { PresenceModule } from '../presence/presence.module';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UserModule, PresenceModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
