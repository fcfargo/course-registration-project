import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { UserSpace } from 'src/entities/UserSpace';

export class joinSpaceRequestDto extends PickType(UserSpace, []) {
  @IsString()
  @MaxLength(8)
  @ApiProperty({
    example: 'ckGqnr6N',
    description: '입장 코드',
  })
  readonly entranceCode: string;
}
