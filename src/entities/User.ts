import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './Chat';
import { Post } from './Post';
import { UserSpace } from './UserSpace';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { UserViewLog } from './UserViewLog';

@Entity('User', { schema: process.env.DB_DATABASE })
export class User {
  @ApiProperty({
    example: 1,
    description: '사용자 id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'theglory@gmail.com',
    description: '사용자 이메일',
    required: true,
  })
  @Column('varchar', { nullable: true, length: 100 })
  email: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1q2w3e4r',
    description: '사용자 비밀번호',
    required: true,
  })
  @Column('varchar', { nullable: true, length: 200 })
  password: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'DongEun',
    description: '사용자 이름',
    required: true,
  })
  @Column('varchar', { nullable: true, length: 100 })
  first_name: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Moon',
    description: '사용자 성',
    required: true,
  })
  @Column('varchar', { nullable: true, length: 100 })
  last_name: string | null;

  @ApiProperty({
    example: null,
    description: '사용자 프로필',
  })
  @Column('varchar', { nullable: true, length: 800 })
  profile_url: string | null;

  @Column('varchar', { nullable: true, length: 400 })
  refresh_token_hash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => UserSpace, (userSpace) => userSpace.user)
  userSpaces: UserSpace[];

  @OneToMany(() => UserViewLog, (userViewLog) => userViewLog.user)
  userViewLogs: UserViewLog[];
}
