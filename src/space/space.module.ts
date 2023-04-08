import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { JwtModule } from '@nestjs/jwt';
import { SpaceRole } from 'src/entities/SpaceRole';
import { UserSpace } from 'src/entities/UserSpace';

@Module({
  imports: [TypeOrmModule.forFeature([Space, UserSpace, SpaceRole]), JwtModule.register({})],
  providers: [SpaceService],
  controllers: [SpaceController],
})
export class SpaceModule {}
