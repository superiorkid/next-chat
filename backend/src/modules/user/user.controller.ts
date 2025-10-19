import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { updateUser } from 'better-auth/api';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getSession(@Session() session: UserSession) {
    const userId = session.user.id;
    return this.userService.getCurrentUserProfile(userId);
  }

  @Patch('me')
  @FormDataRequest()
  async updateUserProfile(
    @Session() session: UserSession,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = session.user.id;
    return this.userService.updateUserProfile({ updateUserDto, userId });
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }
}
