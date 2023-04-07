import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { SpaceRole } from './SpaceRole';

@Entity('Space', { schema: 'dev_classum' })
export class Space {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('varchar', { name: 'logo_url', nullable: true, length: 800 })
  logoUrl: string | null;

  @Column('varchar', { name: 'admin_code', nullable: true, length: 10 })
  adminCode: string | null;

  @Column('varchar', { name: 'user_code', nullable: true, length: 10 })
  userCode: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.space)
  posts: Post[];

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space)
  spaceRoles: SpaceRole[];
}
