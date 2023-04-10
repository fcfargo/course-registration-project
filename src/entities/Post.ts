import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './Chat';
import { Space } from './Space';
import { PostCategory } from './PostCategory';
import { User } from './User';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Index('space_id', ['space_id'], {})
@Index('category_id', ['category_id'], {})
@Index('user_id', ['user_id'], {})
@Entity('Post', { schema: process.env.DB_DATABASE })
export class Post {
  @ApiProperty({
    example: 1,
    description: '게시글 id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 1,
    description: '공간 id',
  })
  @Column('int', { nullable: true })
  space_id: number | null;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '게시글 카테고리 id',
    required: true,
  })
  @Column('int', { nullable: true })
  category_id: number | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '공지사항입니다.',
    description: '게시글 제목',
    required: true,
  })
  @Column('text', { nullable: true })
  title: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '서버 점검 예정입니다.',
    description: '게시글 내용',
    required: true,
  })
  @Column('longtext', { nullable: true })
  content: string | null;

  @Column('int', { nullable: true })
  user_id: number | null;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '익명글 여부',
    required: true,
  })
  @Column('tinyint', { nullable: true })
  is_anonymous: number | null;

  @ApiProperty({
    example: 'https://',
    description: '첨부 파일 주소',
  })
  @Column('varchar', { nullable: true, length: 800 })
  file_url: string | null;

  @IsDateString()
  @ApiProperty({
    example: '2023-04-10T09:08:50.517Z',
    description: '생성 시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @IsDateString()
  @ApiProperty({
    example: '2023-04-10T09:08:50.517Z',
    description: '수정 시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @IsDateString()
  @ApiProperty({
    example: '2023-04-10T09:08:50.517Z',
    description: '삭제 시간',
  })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Chat, (chat) => chat.post)
  chats: Chat[];

  @ManyToOne(() => Space, (space) => space.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_id', referencedColumnName: 'id' }])
  space: Space;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: PostCategory;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
