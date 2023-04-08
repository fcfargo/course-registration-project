import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Space } from './Space';
import { SpaceRoleName } from './SpaceRoleName';

@Index('user_id', ['user_id'], {})
@Index('space_id', ['space_id'], {})
@Index('space_role_id', ['space_role_id'], {})
@Entity('SpaceRole', { schema: 'dev_classum' })
export class SpaceRole {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { nullable: true })
  user_id: number | null;

  @Column('int', { nullable: true })
  space_id: number | null;

  @Column('int', { nullable: true })
  space_role_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.spaceRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Space, (space) => space.spaceRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_id', referencedColumnName: 'id' }])
  space: Space;

  @ManyToOne(() => SpaceRoleName, (spaceRoleName) => spaceRoleName.spaceRoles, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_role_id', referencedColumnName: 'id' }])
  spaceRole: SpaceRoleName;
}
