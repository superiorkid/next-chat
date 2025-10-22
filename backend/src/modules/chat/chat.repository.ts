import { Injectable } from '@nestjs/common';
import { Chat, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class ChatRepository extends BaseRepository<Chat, Prisma.ChatDelegate> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.chat);
  }
}
