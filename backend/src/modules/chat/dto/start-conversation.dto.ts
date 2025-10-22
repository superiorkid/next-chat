import { IsEmail, IsNotEmpty } from 'class-validator';

export class StartConversationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
