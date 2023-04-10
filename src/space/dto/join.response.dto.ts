import { PickType } from '@nestjs/swagger';
import { UserSpace } from 'src/entities/UserSpace';

export class joinSpaceResponseDto extends PickType(UserSpace, ['id', 'user_id', 'space_id', 'space_role_id', 'createdAt', 'deletedAt']) {}
