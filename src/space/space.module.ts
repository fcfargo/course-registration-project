import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { JwtModule } from '@nestjs/jwt';
import { SpaceRole } from 'src/entities/SpaceRole';
import { SpaceRoleName } from 'src/entities/SpaceRoleName';

@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceRole, SpaceRoleName]), JwtModule.register({})],
  providers: [SpaceService],
  controllers: [SpaceController],
})
export class SpaceModule {}
