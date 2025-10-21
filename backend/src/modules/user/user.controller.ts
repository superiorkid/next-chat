import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { type Request } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getSession(@Req() req: Request) {
    const userId = req.user?.['sub'] as string;
    return this.userService.getCurrentUserProfile(userId);
  }

  @Patch('me')
  @FormDataRequest()
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user?.['sub'] as string;
    return this.userService.updateUserProfile({ updateUserDto, userId });
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }
}
