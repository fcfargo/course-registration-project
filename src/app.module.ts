import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './entities/User';
import { Space } from './entities/Space';
import { SpaceRoleName } from './entities/SpaceRoleName';
import { SpaceRole } from './entities/SpaceRole';
import { Post } from './entities/Post';
import { PostCategory } from './entities/PostCategory';
import { Chat } from './entities/Chat';

const DB_PORT: any = process.env.DB_PORT;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Space, SpaceRoleName, SpaceRole, Post, PostCategory, Chat],
      keepConnectionAlive: true,
      migrations: [__dirname + '/migrations/*.ts'],
      charset: 'utf8mb4',
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
