import { PickType } from '@nestjs/swagger';
import { User } from 'src/entities/User';

export class signupRequestDto extends PickType(User, ['email', 'password', 'first_name', 'last_name']) {}
