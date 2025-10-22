import { Injectable } from '@nestjs/common';
import { ChatParticipant, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class ChatParticipantRepository extends BaseRepository<
  ChatParticipant,
  Prisma.ChatParticipantDelegate
> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.chatParticipant);
  }
}
