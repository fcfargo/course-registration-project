import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Chat } from 'src/entities/Chat';
import { JwtModule } from '@nestjs/jwt';
import { UserSpace } from 'src/entities/UserSpace';
import { Space } from 'src/entities/Space';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Chat, UserSpace, Space]), JwtModule.register({})],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
