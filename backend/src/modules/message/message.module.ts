import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageStatusRepository } from './message-status.repository';

@Module({
  providers: [MessageRepository, MessageStatusRepository],
  exports: [MessageRepository, MessageStatusRepository],
})
export class MessageModule {}
