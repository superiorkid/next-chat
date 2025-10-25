import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { type Request } from 'express';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';

@Controller({ version: '1', path: 'chats' })
export class ChatController {
  constructor(
    private chatService: ChatService,
    private chatGateway: ChatGateway,
  ) {}

  @Get()
  async getChatPartners(@Req() req: Request) {
    const userId = req.user?.['sub'] as string;
    return this.chatService.getChatPartners(userId);
  }

  @Post('start')
  async startConversation(
    @Req() req: Request,
    @Body() startConversationDto: StartConversationDto,
  ) {
    const currentUserId = req.user?.['sub'] as string;
    const recipientEmail = startConversationDto.email;
    return this.chatService.startConversation(currentUserId, recipientEmail);
  }

  @Get(':chatId')
  async getDetailPartner(@Req() req: Request, @Param('chatId') chatId: string) {
    const currentUserId = req.user?.['sub'] as string;
    return this.chatService.getDetailPartner({ chatId, currentUserId });
  }

  @Get(':chatId/messages')
  async getMessages(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    // @Query('page', ParseIntPipe) page: number,
  ) {
    return this.chatService.getMessages({
      chatId,
      userId: req.user?.['sub'] as string,
    });
  }

  @Post(':chatId/messages')
  async sendMessage(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const userId = req.user?.['sub'] as string;

    const message = await this.chatService.sendMessage({
      chatId,
      sendMessageDto,
      senderId: userId,
    });

    this.chatGateway.server.to(chatId).emit('chat:new_message', message);

    return { success: true, message: '' };
  }
}
