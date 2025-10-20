import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';

@Controller({ version: '1', path: 'user' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getSession() {
    const userId = '123123123';
    return this.userService.getCurrentUserProfile(userId);
  }

  @Patch('me')
  @FormDataRequest()
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto) {
    const userId = '123123123';
    return this.userService.updateUserProfile({ updateUserDto, userId });
  }

  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }
}
