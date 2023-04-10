import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { ChatService } from './chat.service';
import { ChatResponseDto } from './dto/chat.response.dto';
import { CreateChatRequestDto } from './dto/create.request.dto';

@ApiTags('Chat')
@ApiHeader({
  name: 'Authorization',
  description: 'access_token',
  required: true,
})
@ApiBearerAuth('Authorization')
@UseGuards(AtGuard)
@UseGuards(AtGuard)
@Controller('api/chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: ChatResponseDto,
  })
  @ApiOperation({ summary: '댓글 작성' })
  @Post(':spaceId/:postId')
  async createChat(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateChatRequestDto,
  ) {
    const result = await this.chatService.createChatData(userId, spaceId, postId, body.content, body.is_anonymous);
    return { success: true, result: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: ChatResponseDto,
  })
  @ApiOperation({ summary: '답글 작성' })
  @Post(':spaceId/:postId/:chatId')
  async createChatReply(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() body: CreateChatRequestDto,
  ) {
    const result = await this.chatService.createChatReplyData(userId, spaceId, postId, chatId, body.content, body.is_anonymous);
    return { success: true, result: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        result: {
          type: 'array',
          example: [
            {
              id: 1,
              post_id: 1,
              user_id: 2,
              content: '댓글입니다.',
              chat_id: null,
              is_anonymous: 1,
              createdAt: '2023-04-10T11:58:41.135Z',
              chats: [
                {
                  id: 2,
                  user_id: 2,
                  content: '글입니다.',
                  chat_id: 1,
                  is_anonymous: 0,
                  createdAt: '2023-04-10T12:14:03.785Z',
                  user: {
                    first_name: 'yeonJin',
                    last_name: 'park',
                  },
                },
              ],
              user: {
                first_name: 'dongEun',
                last_name: 'moon',
              },
            },
          ],
        },
      },
    },
  })
  @ApiOperation({ summary: '댓글 목록 가져오기' })
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

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: { properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'DELETE CLEAR' } } },
  })
  @ApiOperation({ summary: '댓글 삭제하기' })
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
