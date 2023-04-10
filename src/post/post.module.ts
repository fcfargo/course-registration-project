import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { Post } from 'src/entities/Post';
import { JwtModule } from '@nestjs/jwt';
import { UserSpace } from 'src/entities/UserSpace';
import { UserViewLog } from 'src/entities/UserViewLog';

@Module({
  imports: [TypeOrmModule.forFeature([Space, Post, UserSpace, UserViewLog]), JwtModule.register({})],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
