import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseRepository } from 'src/shared/database/base.repository';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class UserRepository extends BaseRepository<User, Prisma.UserDelegate> {
  constructor(private databaseService: DatabaseService) {
    super(databaseService, databaseService.user);
  }
}
