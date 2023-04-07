import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './Chat';
import { Post } from './Post';
import { SpaceRole } from './SpaceRole';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

@Entity('User', { schema: 'dev_classum' })
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
  })
  @Column('varchar', { nullable: true, length: 100 })
  email: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1q2w3e4r',
    description: '사용자 비밀번호',
  })
  @Column('varchar', { nullable: true, length: 200 })
  password: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'DongEun',
    description: '사용자 이름',
  })
  @Column('varchar', { nullable: true, length: 100 })
  first_name: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Moon',
    description: '사용자 성',
  })
  @Column('varchar', { nullable: true, length: 100 })
  last_name: string | null;

  @Column('varchar', { nullable: true, length: 800 })
  profile_url: string | null;

  @Column('varchar', { nullable: true, length: 400 })
  refresh_token_hash: string | null;

  @CreateDateColumn()
  last_login: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.user)
  spaceRoles: SpaceRole[];
}
