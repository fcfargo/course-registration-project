import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { ChatService } from './chat.service';
import { createRequestDto } from './dto/create.request.dto';

@Controller('api/chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(AtGuard)
  @Post(':spaceId/:postId')
  async createChat(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: createRequestDto,
  ) {
    const result = await this.chatService.createChatData(userId, spaceId, postId, body.content, body.is_anonymous);
    return { success: true, result: result };
  }

  @UseGuards(AtGuard)
  @Post(':spaceId/:postId/:chatId/replies')
  async createChatReply(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() body: createRequestDto,
  ) {
    const result = await this.chatService.createChatReplyData(userId, spaceId, postId, chatId, body.content, body.is_anonymous);
    return { success: true, result: result };
  }

  @UseGuards(AtGuard)
  @Get(':spaceId/:postId')
  @HttpCode(HttpStatus.OK)
  async getPostChats(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const result = await this.chatService.getChatsByPostId(userId, spaceId, postId);
    return { success: true, result: result };
  }

  @UseGuards(AtGuard)
  @Delete(':spaceId/:postId/:chatId')
  @HttpCode(HttpStatus.OK)
  async deleteChat(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    await this.chatService.destroyChatData(userId, spaceId, postId, chatId);
    return { success: true, message: 'DELETE CLEAR' };
  }
}
