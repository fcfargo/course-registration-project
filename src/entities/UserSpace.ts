import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Space } from './Space';
import { SpaceRole } from './SpaceRole';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

@Index('user_id', ['user_id'], {})
@Index('space_id', ['space_id'], {})
@Index('space_role_id', ['space_role_id'], {})
@Entity('UserSpace', { schema: process.env.DB_DATABASE })
export class UserSpace {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '유저 id',
  })
  @Column('int', { nullable: true })
  user_id: number | null;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '공간 id',
  })
  @Column('int', { nullable: true })
  space_id: number | null;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '공간 역할 id',
  })
  @Column('int', { nullable: true })
  space_role_id: number | null;

  @IsDateString()
  @ApiProperty({
    example: '2023-04-10T09:08:50.517Z',
    description: '생성 시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @IsDateString()
  @ApiProperty({
    example: '2023-04-10T09:08:50.517Z',
    description: '생성 시간',
  })
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
