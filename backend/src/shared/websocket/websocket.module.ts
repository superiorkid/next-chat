import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { PresenceModule } from 'src/modules/presence/presence.module';

@Module({
  imports: [UserModule, PresenceModule],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebSocketModule {}
