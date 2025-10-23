import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TokenType } from '@prisma/client';
import { type Request } from 'express';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { TokenRepository } from 'src/modules/user/token.repository';
import { AccessTokenPayloadType } from '../types/access-token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private tokenRepository: TokenRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'ACCESS_TOKEN_JWT_SECRET_KEY',
        'access-token-key',
      ),
    });
  }

  private static extractJWTFromCookie: JwtFromRequestFunction = (
    req: Request,
  ): string | null => {
    const cookieName = process.env.COOKIE_NAME || '';
    const rawCookie = req.headers.cookie as string;
    const escapedCookieName = cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedCookieName}=([^;]+)`);
    const match = rawCookie.match(regex);
    const token = match ? match[1] : null;
    return token;
  };

  async validate(payload: AccessTokenPayloadType) {
    const token = await this.tokenRepository.findFirst({
      where: { userId: payload.sub, type: TokenType.ACCESS },
    });
    if (!token) throw new UnauthorizedException();
    return payload;
  }
}
