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
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { CreatePostRequestDto } from './dto/create.request.dto';
import { PostResponseDto } from './dto/post.response.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@ApiHeader({
  name: 'Authorization',
  description: 'access_token',
  required: true,
})
@ApiBearerAuth('Authorization')
@UseGuards(AtGuard)
@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: PostResponseDto,
  })
  @ApiOperation({ summary: '공간 게시글 작성' })
  @UseInterceptors(FileInterceptor('file'))
  @Post(':spaceId')
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() body: CreatePostRequestDto,
  ) {
    const result = await this.postService.createPostData(file, userId, spaceId, body.category_id, body.is_anonymous, body.title, body.content);
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
              category_id: 2,
              title: 'question1',
              content: 'are you a student?',
              user_id: 2,
              is_anonymous: 1,
              file_url: 'https://blog-dev-fcfargo.s3.ap-northeast-2.amazonaws.com/post/2/1df03c30-d78c-11ed-9613-556f037b82db',
              createdAt: '2023-04-10T10:40:31.819Z',
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
  @ApiOperation({ summary: '공간 게시글 가져오기' })
  @Get(':spaceId')
  @HttpCode(HttpStatus.OK)
  async getPosts(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number) {
    const result = await this.postService.getPostsBySpaceId(userId, spaceId);
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
          type: 'object',
          example: {
            id: 1,
            category_id: 2,
            title: 'question1',
            content: 'are you a student?',
            user_id: 2,
            is_anonymous: 1,
            file_url: 'https://blog-dev-fcfargo.s3.ap-northeast-2.amazonaws.com/post/2/1df03c30-d78c-11ed-9613-556f037b82db',
            createdAt: '2023-04-10T10:40:31.819Z',
            user: {
              first_name: 'dongEun',
              last_name: 'moon',
            },
          },
        },
      },
    },
  })
  @ApiOperation({ summary: '특정 게시글 가져오기' })
  @Get(':spaceId/:postId')
  @HttpCode(HttpStatus.OK)
  async getPost(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number, @Param('postId', ParseIntPipe) postId: number) {
    const result = await this.postService.getPostByPostId(userId, spaceId, postId);
    return { success: true, result: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: { properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'DELETE CLEAR' } } },
  })
  @ApiOperation({ summary: '공간 게시글 삭제하기' })
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
