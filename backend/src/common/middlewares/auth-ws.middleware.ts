import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { getErrorInfo } from 'src/lib/get-error-info';
import { TokenRepository } from 'src/modules/user/token.repository';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AccessTokenPayloadType } from '../types/access-token-payload.type';
import { AuthenticatedSocket } from '../types/authenticate-socket.type';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const AuthWsMiddleware = (
  jwtService: JwtService,
  configService: ConfigService,
  tokenRepository: TokenRepository,
): SocketMiddleware => {
  return (socket: AuthenticatedSocket, next) => {
    void (async () => {
      try {
        const cookies = socket.handshake.headers.cookie?.split('; ');
        const tokenCookie = cookies?.find((c) =>
          c.startsWith(`${process.env.COOKIE_NAME}=`),
        );
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        if (!token) throw new Error('Authorization token is missing');

        const payload = await jwtService.verifyAsync<AccessTokenPayloadType>(
          token,
          {
            secret: configService.get(
              'ACCESS_TOKEN_JWT_SECRET_KEY',
              'access-token-key',
            ),
          },
        );

        const strategy = new JwtStrategy(configService, tokenRepository);
        const user = await strategy.validate(payload);

        if (!user) throw new Error('User not found or invalid token');

        socket.user = user;
        next();
      } catch (error) {
        const errorInfo = getErrorInfo(error);
        console.error('WS Auth Error:', errorInfo.message);
        next(new Error('Unauthorized'));
      }
    })();
  };
};
