import { PickType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { UserSpace } from 'src/entities/UserSpace';

export class joinRequestDto extends PickType(UserSpace, []) {
  @IsString()
  @MaxLength(8)
  readonly entranceCode: string;
}
