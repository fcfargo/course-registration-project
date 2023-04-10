import { PickType } from '@nestjs/swagger';
import { Chat } from 'src/entities/Chat';

export class ChatResponseDto extends PickType(Chat, [
  'id',
  'post_id',
  'user_id',
  'content',
  'is_anonymous',
  'content',
  'chat_id',
  'createdAt',
  'deletedAt',
]) {}
