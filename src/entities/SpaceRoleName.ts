import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpaceRole } from './SpaceRole';

@Entity('SpaceRoleName', { schema: 'dev_classum' })
export class SpaceRoleName {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', nullable: true, length: 100 })
  name: string | null;

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.spaceRole)
  spaceRoles: SpaceRole[];
}
