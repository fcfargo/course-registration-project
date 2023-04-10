import { PickType } from '@nestjs/swagger';
import { Chat } from 'src/entities/Chat';

export class CreateChatRequestDto extends PickType(Chat, ['is_anonymous', 'content']) {}
