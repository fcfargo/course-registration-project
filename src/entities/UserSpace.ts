import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Space } from './Space';
import { SpaceRole } from './SpaceRole';

@Index('user_id', ['user_id'], {})
@Index('space_id', ['space_id'], {})
@Index('space_role_id', ['space_role_id'], {})
@Entity('UserSpace', { schema: 'dev_classum' })
export class UserSpace {
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

  @ManyToOne(() => User, (user) => user.userSpaces, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Space, (space) => space.userSpaces, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_id', referencedColumnName: 'id' }])
  space: Space;

  @ManyToOne(() => SpaceRole, (spaceRole) => spaceRole.userSpaces, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_role_id', referencedColumnName: 'id' }])
  spaceRole: SpaceRole;
}
