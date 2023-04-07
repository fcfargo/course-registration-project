import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './Chat';
import { Space } from './Space';
import { PostCategory } from './PostCategory';
import { User } from './User';

@Index('space_id', ['spaceId'], {})
@Index('category_id', ['categoryId'], {})
@Index('user_id', ['userId'], {})
@Entity('Post', { schema: 'dev_classum' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'space_id', nullable: true })
  spaceId: number | null;

  @Column('int', { name: 'category_id', nullable: true })
  categoryId: number | null;

  @Column('text', { name: 'title', nullable: true })
  title: string | null;

  @Column('longtext', { name: 'content', nullable: true })
  content: string | null;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('varchar', { name: 'image_url', nullable: true, length: 800 })
  imageUrl: string | null;

  @Column('varchar', { name: 'file_url', nullable: true, length: 800 })
  fileUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

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
