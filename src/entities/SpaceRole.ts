import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Space } from './Space';
import { UserSpace } from './UserSpace';

@Index('space_id', ['space_id'], {})
@Entity('SpaceRole', { schema: process.env.DB_DATABASE })
export class SpaceRole {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @Column('int', { nullable: true })
  role_type: number | null;

  @Column('int', { nullable: true })
  space_id: number | null;

  @ManyToOne(() => Space, (space) => space.spaceRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'space_id', referencedColumnName: 'id' }])
  space: Space;

  @OneToMany(() => UserSpace, (userSpace) => userSpace.spaceRole)
  userSpaces: UserSpace[];
}
