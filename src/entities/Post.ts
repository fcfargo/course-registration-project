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
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Index('space_id', ['space_id'], {})
@Index('category_id', ['category_id'], {})
@Index('user_id', ['user_id'], {})
@Entity('Post', { schema: process.env.DB_DATABASE })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { nullable: true })
  space_id: number | null;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '게시글 카테고리 id',
  })
  @Column('int', { nullable: true })
  category_id: number | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '공지사항입니다.',
    description: '게시글 제목',
  })
  @Column('text', { nullable: true })
  title: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '서버 점검 예정입니다.',
    description: '게시글 내용',
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
  })
  @Column('tinyint', { nullable: true })
  is_anonymous: number | null;

  @Column('varchar', { nullable: true, length: 800 })
  file_url: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
