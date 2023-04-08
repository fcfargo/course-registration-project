import { PickType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { SpaceRole } from 'src/entities/SpaceRole';

export class joinRequestDto extends PickType(SpaceRole, []) {
  @IsString()
  @MaxLength(8)
  readonly entranceCode: string;
}
