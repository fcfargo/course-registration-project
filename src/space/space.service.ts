import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from 'src/entities/Space';
import { getConnection, Repository } from 'typeorm';
import { Str } from '@supercharge/strings';
import { UserSpace } from 'src/entities/UserSpace';
import { SpaceRole } from 'src/entities/SpaceRole';

@Injectable()
export class SpaceService {
  @InjectRepository(Space)
  private spaceRepository: Repository<Space>;
  @InjectRepository(UserSpace)
  private userSpaceRepository: Repository<UserSpace>;
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
      const createdSpaceRole = await queryRunner.manager.getRepository(SpaceRole).save({
        name: '개설자',
        role_type: 0, // 0: 개설자, 1: 관리자 2: 참여자
        space_id: createdSpace.id,
      });

      // UserSpace 정보 생성
      await queryRunner.manager.getRepository(UserSpace).save({
        user_id: userId,
        space_id: createdSpace.id,
        space_role_id: createdSpaceRole.id,
      });

      await queryRunner.commitTransaction();

      return this.spaceRepository
        .createQueryBuilder('space')
        .select(['space.id', 'space.name', 'space.logo_url', 'space.createdAt', 'space.deletedAt'])
        .where('space.id = :id', { id: createdSpace.id })
        .innerJoinAndSelect('space.userSpaces', 'users')
        .getOne();
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

    // 이미 참여한 이력 있는지 조회
    const userSpace = await this.userSpaceRepository.findOne({ where: { user_id: userId, space_id: space.id } });
    if (userSpace) throw new BadRequestException('이미 참여한 공간입니다.');

    // 입장 코드 확인
    const checkSpaceEntranceCode = await this.checkSpaceEntranceCode(space.admin_code, space.user_code, entranceCode);
    if (!checkSpaceEntranceCode) throw new BadRequestException('입장 코드가 올바르지 않습니다.');

    // 공간 역할 id 확인
    const spaceRole = await this.spaceRoleRepository.findOne({ where: { id: spaceRoleId, space_id: spaceId } });
    if (!spaceRole) throw new BadRequestException('존재하지 않는 공간 역할입니다.');

    // 설정할 수 있는 공간 역할인지 확인
    // 0: 개설자, 1: 관리자 2: 참여자
    if (checkSpaceEntranceCode.roleType !== spaceRole.role_type) throw new BadRequestException('설정할 수 없는 역할 id입니다.');

    // 공간 역할 정보 생성
    const result = await this.userSpaceRepository.save({
      user_id: userId,
      space_id: space.id,
      space_role_id: spaceRoleId,
    });

    return result;
  }

  /** 공간 입장 코드 확인하기 */
  async checkSpaceEntranceCode(adminCode: string, userCode: string, entranceCode: string) {
    // 관리자용 입장 코드 여부 확인
    if (entranceCode === adminCode) return { roleType: 1 };

    // 참여자용 입장 코드 여부 확인
    if (entranceCode === userCode) return { roleType: 2 };
    return false;
  }

  /** 공간 정보 삭제하기 */
  async destroySpaceData(userId: number, spaceId: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 개설자 여부 확인
    const userSpace = await this.userSpaceRepository
      .createQueryBuilder('userSpace')
      .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
      .where('userSpace.user_id = :userId', { userId })
      .andWhere('userSpace.space_id = :spaceId', { spaceId })
      .innerJoin('userSpace.spaceRole', 'role')
      .getOne();

    // 공간 참여 유저가 아닌 경우 || 공간 참여 유저지만 개설자가 아닌 경우
    if (!userSpace || (userSpace && userSpace.spaceRole.role_type !== 0)) throw new BadRequestException('개설자만 공간 삭제가 가능합니다.');

    return await this.spaceRepository.softDelete({ id: spaceId });
  }

  /** 역할 정보 삭제하기 */
  async destroySpaceRoleData(userId: number, spaceId: number, spaceRoleId: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 공간 역할 id 확인
    const spaceRole = await this.spaceRoleRepository.findOne({ where: { id: spaceRoleId } });
    if (!spaceRole) throw new BadRequestException('존재하지 않는 공간 역할 정보입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인
    const userSpace = await this.userSpaceRepository
      .createQueryBuilder('userSpace')
      .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
      .where('userSpace.user_id = :userId', { userId })
      .andWhere('userSpace.space_id = :spaceId', { spaceId })
      .innerJoin('userSpace.spaceRole', 'role')
      .getOne();

    // 공간 참여 유저가 아닌 경우 || 공간 참여 유저지만 개설자 혹은 관리자가 아닌 경우
    // 0: 개설자, 1: 관리자 2: 참여자
    if (!userSpace || (userSpace && userSpace.spaceRole.role_type === 2))
      throw new BadRequestException('개설자 혹은 관리자만 역할 삭제가 가능합니다.');

    return await this.spaceRoleRepository.softDelete({ id: spaceRoleId });
  }
}
