import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/Chat';
import { Post } from 'src/entities/Post';
import { Space } from 'src/entities/Space';
import { UserSpace } from 'src/entities/UserSpace';
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
import { v1 as uuidv1 } from 'uuid';

@Injectable()
export class PostService {
  @InjectRepository(Space)
  private spaceRepository: Repository<Space>;
  @InjectRepository(UserSpace)
  private userSpaceRepository: Repository<UserSpace>;
  @InjectRepository(Post)
  private postRepository: Repository<Post>;
  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;

  /** 공간 게시글 생성하기 */
  async createPostData(
    file: Express.Multer.File,
    userId: number,
    spaceId: number,
    categoryId: number,
    isAnonymous: number,
    title: string,
    content: string,
  ) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인
    const userSpace = await this.userSpaceRepository
      .createQueryBuilder('userSpace')
      .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
      .where('userSpace.user_id = :userId', { userId })
      .andWhere('userSpace.space_id = :spaceId', { spaceId })
      .innerJoin('userSpace.spaceRole', 'role')
      .getOne();

    // 공간 참여 유저가 아닌 경우 || 공간 참여 유저지만 공지글 권한이 없는 경우
    // role_type(0: 개설자, 1 관리자, 2: 참여자)
    // categoryId(1. 공지, 2. 질문)
    if (!userSpace || (userSpace && categoryId === 1 && userSpace.spaceRole.role_type === 2))
      throw new BadRequestException('게시글을 작성 권한이 없습니다.');

    // 관리자가 및 개설자가 익명으로 게시글을 작성하는 경우
    if (isAnonymous && userSpace.spaceRole.role_type !== 2) throw new BadRequestException('관리자 및 개설자는 익명으로 게시글을 작성할 수 없습니다.');

    // 이미지 업로드
    const uploadedFile = await this.uploadFile(file.buffer, userId);

    // 게시글 생성
    const result = await this.postRepository.save({
      space_id: spaceId,
      category_id: categoryId,
      title: title,
      content: content,
      file_url: uploadedFile?.Location || null,
      user_id: userId,
      is_anonymous: isAnonymous,
    });
    return result;
  }

  /** 파일 업로드 */
  async uploadFile(body: Buffer, userId: number) {
    AWS.config.update({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    try {
      const upload = await new AWS.S3()
        .upload({
          Key: `post/${userId}/${uuidv1()}`,
          Body: body,
          Bucket: process.env.AWS_BUCKET,
        })
        .promise();
      return upload;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('이미지 업로드에 실패했습니다.');
    }
  }
}
