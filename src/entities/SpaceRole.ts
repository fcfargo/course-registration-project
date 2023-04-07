import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Space } from './Space';
import { SpaceRoleName } from './SpaceRoleName';

@Index('user_id', ['userId'], {})
@Index('space_id', ['spaceId'], {})
@Index('space_role_id', ['spaceRoleId'], {})
@Entity('SpaceRole', { schema: 'dev_classum' })
export class SpaceRole {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('int', { name: 'space_id', nullable: true })
  spaceId: number | null;

  @Column('tinyint', { name: 'is_host', nullable: true, default: () => "'0'" })
  isHost: number | null;

  @Column('int', { name: 'space_role_id', nullable: true })
  spaceRoleId: number | null;

  @CreateDateColumn()
  createdAt: Date;

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
