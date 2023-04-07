import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class joinRequestDto extends PickType(User, ['email', 'password', 'first_name', 'last_name']) {}
