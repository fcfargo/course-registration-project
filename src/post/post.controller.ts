import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { createRequestDto } from './dto/create.request.dto';
import { PostService } from './post.service';

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AtGuard)
  @Post(':spaceId')
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() body: createRequestDto,
  ) {
    const result = await this.postService.createPostData(file, userId, spaceId, body.category_id, body.is_anonymous, body.title, body.content);
    return { success: true, result: result };
  }

  @UseGuards(AtGuard)
  @Get(':spaceId')
  @HttpCode(HttpStatus.OK)
  async getPosts(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number) {
    const result = await this.postService.getPostsBySpaceId(userId, spaceId);
    return { success: true, result: result };
  }

  @UseGuards(AtGuard)
  @Delete(':spaceId/:postId')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    await this.postService.destroyPostData(userId, spaceId, postId);
    return { success: true, message: 'DELETE CLEAR' };
  }
}
