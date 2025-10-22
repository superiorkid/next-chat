import { Injectable } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class MessageRepository extends BaseRepository<
  Message,
  Prisma.MessageDelegate
> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.message);
  }
}
