import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
import { SpaceRole } from './SpaceRole';
import { UserSpace } from './UserSpace';

@Entity('Space', { schema: 'dev_classum' })
export class Space {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '웹 개발',
    description: '공간 이름',
  })
  @Column('varchar', { nullable: true, length: 100 })
  name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'http://logo',
    description: '공간 로고 url',
  })
  @Column('varchar', { nullable: true, length: 800 })
  logo_url: string | null;

  @Column('varchar', { nullable: true, length: 10 })
  admin_code: string | null;

  @Column('varchar', { nullable: true, length: 10 })
  user_code: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Post, (post) => post.space)
  posts: Post[];

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.space)
  spaceRoles: SpaceRole[];

  @OneToMany(() => UserSpace, (userSpace) => userSpace.space)
  userSpaces: UserSpace[];
}
