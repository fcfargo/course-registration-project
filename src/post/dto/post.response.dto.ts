import { PickType } from '@nestjs/swagger';
import { Post } from 'src/entities/Post';

export class PostResponseDto extends PickType(Post, [
  'id',
  'space_id',
  'category_id',
  'title',
  'content',
  'file_url',
  'user_id',
  'is_anonymous',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
