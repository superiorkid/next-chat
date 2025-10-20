import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class SessionRepository extends BaseRepository<
  Session,
  Prisma.SessionDelegate
> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.session);
  }
}
