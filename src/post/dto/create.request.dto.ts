import { PickType } from '@nestjs/swagger';
import { Post } from 'src/entities/Post';

export class CreatePostRequestDto extends PickType(Post, ['category_id', 'is_anonymous', 'title', 'content']) {}
