import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthWsMiddleware } from 'src/common/middlewares/auth-ws.middleware';
import { PresenceService } from 'src/modules/presence/presence.service';
import { DatabaseService } from 'src/shared/database/database.service';
import { type AuthenticatedSocket } from '../types/authenticate-socket.type';

@WebSocketGateway({ cors: { origin: '*' } })
export abstract class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  protected readonly logger = new Logger(WebSocketGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly jwtService: JwtService,
    protected readonly presenceService: PresenceService,
    protected readonly databaseService: DatabaseService,
  ) {}

  afterInit(server: Server) {
    server.use(
      AuthWsMiddleware(
        this.jwtService,
        this.configService,
        this.databaseService,
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

  @SubscribeMessage('get_online_users')
  handleGetOnlineUsers(@ConnectedSocket() socket: AuthenticatedSocket) {
    const onlineUsers = this.presenceService.getOnlineUsers();
    socket.emit('online_users', onlineUsers);
  }
}
