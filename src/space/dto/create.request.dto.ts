import { PickType } from '@nestjs/swagger';
import { Space } from 'src/entities/Space';

export class CreateSpaceRequestDto extends PickType(Space, ['name', 'logo_url']) {}
