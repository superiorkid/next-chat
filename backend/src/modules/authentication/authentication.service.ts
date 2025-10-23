import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenType, User } from '@prisma/client';
import argon2 from 'argon2';
import { getErrorInfo } from 'src/lib/get-error-info';
import { SessionRepository } from 'src/modules/user/session.repository';
import { TokenRepository } from 'src/modules/user/token.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { RegisterDto } from './dtos/register.dto';
import { Response } from 'express';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const passwordMatches = await argon2.verify(user.passwordHash, password);
    if (!passwordMatches)
      throw new BadRequestException('Password does not match');
    return user;
  }

  async login(params: {
    res: Response;
    user: User;
    userAgent?: string;
    ipAddress?: string;
  }) {
    const { user, ipAddress, userAgent, res } = params;
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_JWT_EXPIRES_IN', '1d'),
      secret: this.configService.get(
        'ACCESS_TOKEN_JWT_SECRET_KEY',
        'access-token-secret',
      ),
    });

    const expiresAt = new Date(
      Date.now() +
        this.parseExpiresIn(
          this.configService.get('ACCESS_TOKEN_JWT_EXPIRES_IN', '7d'),
        ),
    );

    await Promise.all([
      this.tokenRepository.create({
        data: {
          userId: user.id,
          token: accessToken,
          type: TokenType.ACCESS,
          expiresAt,
        },
      }),
      this.sessionRepository.create({
        data: { userId: user.id, userAgent, ipAddress },
      }),
    ]);

    res.cookie(process.env.COOKIE_NAME as string, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      success: true,
      message: 'Login successfully',
      data: { access_token: accessToken },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;
    const existingUser = await this.userRepository.findUnique({
      where: { email },
    });
    if (existingUser) throw new ConflictException('Email already exists');
    const hashedPassword = await argon2.hash(password);

    try {
      await this.userRepository.create({
        data: { name, email, passwordHash: hashedPassword },
      });
      return { success: true, message: 'User registered successfully' };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          id: 'user-registration-error',
          email: email,
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to register user',
      );

      throw new InternalServerErrorException(
        'Registration failed. Please try again later.',
      );
    }
  }

  async logout(params: { userId: string; res: Response }) {
    const { res, userId } = params;
    try {
      await Promise.all([
        this.tokenRepository.deleteMany({
          where: {
            userId,
            type: 'ACCESS',
          },
        }),
        this.sessionRepository.deleteMany({
          where: {
            userId,
          },
        }),
      ]);

      res.cookie(process.env.COOKIE_NAME as string, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), // expire immedietely
      });

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      const errorInfo = getErrorInfo(error);

      this.logger.error(
        {
          id: 'user-logout-error',
          error: errorInfo.message,
          stack: errorInfo.stack,
          timestamp: new Date().toISOString(),
        },
        'Failed to logout user',
      );

      throw new InternalServerErrorException('Logout failed');
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 86400000;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 86400000;
    }
  }
}
