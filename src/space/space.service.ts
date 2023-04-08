import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { User } from 'src/entities/User';
import { getConnection, Repository } from 'typeorm';
import { Str } from '@supercharge/strings';
import { SpaceRole } from 'src/entities/SpaceRole';
import { check } from 'prettier';

@Injectable()
export class SpaceService {
  @InjectRepository(Space)
  private spaceRepository: Repository<Space>;
  @InjectRepository(SpaceRole)
  private spaceRoleRepository: Repository<SpaceRole>;

  /** 공간 정보 생성하기 */
  async createSpaceData(userId: number, name: string, logoUrl: string) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 공간 정보 생성
      const createdSpace = await queryRunner.manager.getRepository(Space).save({
        name,
        logo_url: logoUrl,
        admin_code: Str.random(8),
        user_code: Str.random(8),
      });

      // 공간 역할 정보 생성
      await queryRunner.manager.getRepository(SpaceRole).save({
        user_id: userId,
        space_id: createdSpace.id,
        space_role_id: 1, // 1: 개설자, 2: 교수(관리자), 3: 조교(관리자), 4: 학생(참여자)
      });

      await queryRunner.commitTransaction();

      return this.spaceRepository
        .createQueryBuilder('space')
        .select(['space.id', 'space.name', 'space.logo_url', 'space.createdAt', 'space.deletedAt'])
        .where('space.id = :id', { id: createdSpace.id })
        .innerJoinAndSelect('space.spaceRoles', 'roles')
        .getMany();
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('DB가 공간 생성 처리에 실패했습니다.[transaction error]');
    } finally {
      await queryRunner.release();
    }
  }

  /** 공간 참여 정보 생성하기  */
  async createSpaceMemberData(userId: number, spaceId: number, spaceRoleId: number, entranceCode: string) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 입장 코드 확인
    const checkSpaceEntranceCode = await this.checkSpaceEntranceCode(space.admin_code, space.user_code, entranceCode);
    if (!checkSpaceEntranceCode) throw new BadRequestException('입장 코드가 올바르지 않습니다.');

    // 공간 역할 id 확인
    const checkSpaceRoleId = await this.checkSpaceRoleId(checkSpaceEntranceCode.roleType, spaceRoleId);
    if (!checkSpaceRoleId) throw new BadRequestException('설정할 수 없는 역할 id입니다.');

    // 공간 역할 정보 생성
    const result = await this.spaceRoleRepository.save({
      user_id: userId,
      space_id: space.id,
      space_role_id: spaceRoleId,
    });

    return result;
  }

  /** 공간 입장 코드 확인하기 */
  async checkSpaceEntranceCode(adminCode: string, userCode: string, entranceCode: string) {
    // 관리자용 입장 코드 여부 확인
    if (entranceCode === adminCode) return { roleType: 'admin' };

    // 참여자용 입장 코드 여부 확인
    if (entranceCode === userCode) return { roleType: 'user' };
    return false;
  }

  /** 공간 역할 id 확인하기 */
  async checkSpaceRoleId(roleType: string, spaceRoleId: number) {
    // 관리자용 역할 코드
    const adminRoles = [1, 2];

    // 참여자용 역할 코드
    const userRoles = [3, 4];
    if (roleType === 'admin') return adminRoles.includes(spaceRoleId);
    return userRoles.includes(spaceRoleId);
  }
}
