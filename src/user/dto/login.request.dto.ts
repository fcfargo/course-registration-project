import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class loginRequestDto extends PickType(User, ['email', 'password']) {}
