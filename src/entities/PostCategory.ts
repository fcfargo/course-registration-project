import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';

@Entity('PostCategory', { schema: process.env.DB_DATABASE })
export class PostCategory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
