import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@Index('post_id', ['postId'], {})
@Index('user_id', ['userId'], {})
@Index('chat_id', ['chatId'], {})
@Entity('Chat', { schema: 'dev_classum' })
export class Chat {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'post_id', nullable: true })
  postId: number | null;

  @Column('int', { name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('longtext', { name: 'content', nullable: true })
  content: string | null;

  @Column('int', { name: 'chat_id', nullable: true })
  chatId: number | null;

  @CreateDateColumn()
  createdAt: Date;

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
