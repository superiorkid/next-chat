import { Injectable } from '@nestjs/common';
import { Prisma, Token } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class TokenRepository extends BaseRepository<
  Token,
  Prisma.TokenDelegate
> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.token);
  }
}
