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

  handleConnection(socket: AuthenticatedSocket) {
    if (socket.user) {
      this.logger.log(`User connected: ${socket.user.email}`);
    } else {
      this.logger.warn(`User not authenticated on socket ${socket.id}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    if (socket.user) {
      this.logger.log(`User disconnected: ${socket.user.email}`);
    }
  }
}
