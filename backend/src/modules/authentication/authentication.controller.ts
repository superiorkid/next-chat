import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { type Request, type Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalGuard } from '../../common/guards/local.guard';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';

@Controller({ version: '1', path: 'auth' })
export class AuthentionController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  @Public()
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authenticationService.login({
      res,
      user: req.user as User,
      userAgent: req.headers['user-agent'],
      ipAddress: ip,
    });
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Get('session')
  async getSession(@Req() req: Request) {
    const userId = req.user?.['sub'] as string;
    return this.authenticationService.getSession(userId);
  }

  @Delete('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user?.['sub'] as string;
    return this.authenticationService.logout({ userId, res });
  }
}
