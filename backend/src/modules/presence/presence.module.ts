import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
