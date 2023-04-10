import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Index('post_id', ['post_id'], {})
@Index('user_id', ['user_id'], {})
@Index('chat_id', ['chat_id'], {})
@Entity('Chat', { schema: process.env.DB_DATABASE })
export class Chat {
  @ApiProperty({
    example: 1,
    description: '댓글 id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 1,
    description: '게시글 id',
  })
  @Column('int', { nullable: true })
  post_id: number | null;

  @ApiProperty({
    example: 1,
    description: '유저 id',
  })
  @Column('int', { nullable: true })
  user_id: number | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '안녕하세요 반값습니다.',
    description: '댓글 내용',
    required: true,
  })
  @Column('longtext', { nullable: true })
  content: string | null;

  @ApiProperty({
    example: 1,
    description: '답글 작성하려는 댓글 id',
  })
  @Column('int', { nullable: true })
  chat_id: number | null;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: '익명 댓글 여부',
    required: true,
  })
  @Column('tinyint', { nullable: true })
  is_anonymous: number | null;

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
    description: '삭제 시간',
  })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Post, (post) => post.chats, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => User, (user) => user.chats, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chats, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'chat_id', referencedColumnName: 'id' }])
  chat_2: Chat;

  @OneToMany(() => Chat, (chat) => chat.chat_2)
  chats: Chat[];
}
