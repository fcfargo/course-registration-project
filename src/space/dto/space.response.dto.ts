import { ApiProperty, PickType } from '@nestjs/swagger';
import { Space } from 'src/entities/Space';

export class SpaceResponseDto extends PickType(Space, ['id', 'name', 'logo_url', 'createdAt', 'deletedAt']) {
  @ApiProperty({
    type: [Object],
  })
  readonly userSpaces: Array<object>;
}
