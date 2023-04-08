import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { Post } from 'src/entities/Post';
import { JwtModule } from '@nestjs/jwt';
import { Chat } from 'src/entities/Chat';
import { UserSpace } from 'src/entities/UserSpace';

@Module({
  imports: [TypeOrmModule.forFeature([Space, Post, Chat, UserSpace]), JwtModule.register({})],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
