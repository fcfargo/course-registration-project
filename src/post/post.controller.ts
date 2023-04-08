import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { createRequestDto } from './dto/create.request.dto';
import { PostService } from './post.service';

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AtGuard)
  @Post(':spaceId')
  async createPost(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number, @Body() body: createRequestDto) {
    const result = await this.postService.createPostData(userId, spaceId, body.category_id, body.is_anonymous, body.title, body.content);
    return { success: true, result: result };
  }
}
