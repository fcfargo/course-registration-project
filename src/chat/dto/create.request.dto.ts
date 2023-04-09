import { PickType } from '@nestjs/swagger';
import { Chat } from 'src/entities/Chat';

export class createRequestDto extends PickType(Chat, ['is_anonymous', 'content']) {}
