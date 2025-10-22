import { Injectable } from '@nestjs/common';
import { MessageStatus, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class MessageStatusRepository extends BaseRepository<
  MessageStatus,
  Prisma.MessageStatusDelegate
> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.messageStatus);
  }
}
