import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Index('user_id', ['user_id'], {})
@Index('post_id', ['post_id'], {})
@Entity('UserViewLog', { schema: process.env.DB_DATABASE })
export class UserViewLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int', { nullable: true })
  user_id: number | null;

  @Column('int', { nullable: true })
  post_id: number | null;

  @CreateDateColumn()
  view_date: Date;

  @Column('int', { nullable: true })
  job_id: number | null;

  @Column('int', { nullable: true })
  type_id: number | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.userViewLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Post, (post) => post.userViewLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'post_id', referencedColumnName: 'id' }])
  post: Post;
}
