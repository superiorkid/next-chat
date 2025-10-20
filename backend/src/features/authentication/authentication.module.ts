import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { LocalStrategy } from 'src/common/strategies/local.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { AuthentionController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(
          'DEFAULT_JWT_SECRET_KEY',
          'very-very-secret',
        ),
        signOptions: {
          expiresIn: configService.get('DEFAULT_JWT_EXPIRES_IN', '60s'),
        },
      }),
    }),
  ],
  controllers: [AuthentionController],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
