import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './entities/User';
import { Space } from './entities/Space';
import { Post } from './entities/Post';
import { PostCategory } from './entities/PostCategory';
import { Chat } from './entities/Chat';
import { SpaceModule } from './space/space.module';
import { SpaceRole } from './entities/SpaceRole';
import { UserSpace } from './entities/UserSpace';
import { PostModule } from './post/post.module';
import { ChatModule } from './chat/chat.module';
import { UserViewLog } from './entities/UserViewLog';

const DB_PORT: any = process.env.DB_PORT;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.development' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Space, UserSpace, SpaceRole, Post, PostCategory, Chat, UserViewLog],
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4',
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      timezone: '+09:00',
    }),
    UserModule,
    SpaceModule,
    PostModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
