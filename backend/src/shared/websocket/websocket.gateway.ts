import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  AuthWsMiddleware,
} from 'src/common/middlewares/auth-ws.middleware';
import { PresenceService } from 'src/modules/presence/presence.service';
import { TokenRepository } from 'src/modules/user/token.repository';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebSocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly presenceService: PresenceService,
  ) {}

  afterInit(server: Server) {
    server.use(
      AuthWsMiddleware(
        this.jwtService,
        this.configService,
        this.tokenRepository,
      ),
    );

    this.logger.log('WebSocket server initialized');
  }

  async handleConnection(socket: AuthenticatedSocket) {
    const user = socket.user;
    if (!user) {
      socket.disconnect();
      return;
    }

    await this.presenceService.setOnline(user.sub, socket.id);
    this.server.emit('user_online', { userId: user.sub });
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    await this.presenceService.setOffline(socket.id);
    this.server.emit('user_offline', {
      userId: socket.user?.sub,
      lastSeen: new Date(),
    });
  }
}
