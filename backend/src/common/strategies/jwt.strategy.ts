import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TokenType } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenRepository } from 'src/modules/user/token.repository';
import { AccessTokenPayloadType } from '../types/access-token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private tokenRepository: TokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'ACCESS_TOKEN_JWT_SECRET_KEY',
        'access-token-key',
      ),
    });
  }

  async validate(payload: AccessTokenPayloadType) {
    const token = await this.tokenRepository.findFirst({
      where: { userId: payload.sub, type: TokenType.ACCESS },
    });
    if (!token) throw new UnauthorizedException();
    return payload;
  }
}
