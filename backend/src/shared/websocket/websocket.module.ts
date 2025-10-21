import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebSocketModule {}
