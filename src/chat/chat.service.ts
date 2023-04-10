import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities/Chat';
import { Post } from 'src/entities/Post';
import { Space } from 'src/entities/Space';
import { UserSpace } from 'src/entities/UserSpace';
import { UserViewLog } from 'src/entities/UserViewLog';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;
  @InjectRepository(Space)
  private spaceRepository: Repository<Space>;
  @InjectRepository(UserSpace)
  private userSpaceRepository: Repository<UserSpace>;
  @InjectRepository(Post)
  private postRepository: Repository<Post>;
  @InjectRepository(UserViewLog)
  private userViewLogRepository: Repository<UserViewLog>;

  /** 게시글 댓글 가져오기 */
  async getChatsByPostId(userId: number, spaceId: number, postId: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 게시글 id 확인
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('존재하지 않는 게시글입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인 && 게시글 가져오기
    const [userSpace, chats] = await Promise.all([
      this.userSpaceRepository
        .createQueryBuilder('userSpace')
        .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
        .where('userSpace.user_id = :userId', { userId })
        .andWhere('userSpace.space_id = :spaceId', { spaceId })
        .innerJoin('userSpace.spaceRole', 'role')
        .getOne(),
      this.chatRepository
        .createQueryBuilder('chat')
        .where('chat.post_id = :postId', { postId })
        .andWhere('chat.chat_id IS NULL')
        .leftJoin('chat.chats', 'reply')
        .leftJoin('reply.user', 'replyUser')
        .innerJoin('chat.user', 'user')
        .select([
          'chat.id',
          'chat.chat_id',
          'chat.post_id',
          'chat.user_id',
          'chat.content',
          'chat.createdAt',
          'chat.is_anonymous',
          'reply.id',
          'reply.chat_id',
          'reply.user_id',
          'reply.content',
          'reply.createdAt',
          'reply.is_anonymous',
          'user.first_name',
          'user.last_name',
          'replyUser.first_name',
          'replyUser.last_name',
        ])
        .getMany(),
    ]);

    // 유저 정보 가리기(참여자가 아닌 경우, 참여자이면서 본인이 작성한 게시글이 아닐 경우)
    // role_type(0: 개설자, 1 관리자, 2: 참여자)
    return chats.map((chat) => {
      // 익명 답글 유저 정보 가리기
      chat.chats.map((reply) => {
        if (reply.is_anonymous === 1) {
          reply.user = !userSpace || (userSpace?.spaceRole.role_type === 2 && reply.user_id !== userId) ? null : reply.user;
          return reply;
        }
        return reply;
      });

      // 익명 댓글 유저 정보 가리기
      if (chat.is_anonymous === 1) {
        chat.user = !userSpace || (userSpace?.spaceRole.role_type === 2 && chat.user_id !== userId) ? null : chat.user;
        return chat;
      }
      return chat;
    });
  }

  /** 댓글 생성하기 */
  async createChatData(userId: number, spaceId: number, postId: number, content: string, isAnonymous: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 게시글 id 확인
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('존재하지 않는 게시글입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인
    const [userSpace, userChatViewLog] = await Promise.all([
      this.userSpaceRepository
        .createQueryBuilder('userSpace')
        .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
        .where('userSpace.user_id = :userId', { userId })
        .andWhere('userSpace.space_id = :spaceId', { spaceId })
        .innerJoin('userSpace.spaceRole', 'role')
        .getOne(),
      this.userViewLogRepository.findOne({ where: { user_id: userId, post_id: postId, type_id: 1 } }),
    ]);

    if (!userChatViewLog) {
      // chat 생성 로그 정보 생성(비동기 처리)
      // job_id(0: 읽음, 1: 게시글 업데이트 || 댓글 추가)
      // type_id(0: 게시글 관련 로그, 1: 댓글 관련 로그)
      this.userViewLogRepository.save({
        user_id: userId,
        post_id: postId,
        job_id: 1,
        type_id: 1,
      });
    }

    if (userChatViewLog && userChatViewLog?.job_id === 0) {
      // chat 조회 로그 정보를 '읽음'으로 수정(비동기 처리)
      this.userViewLogRepository.update(
        {
          user_id: userId,
          post_id: postId,
          type_id: 1,
        },
        {
          job_id: 1,
        },
      );
    }

    // 공간 구성원이 아닌 유저가 익명 댓글을 작성하는 경우
    // 관리자가 및 개설자가 익명 댓글을 작성하는 경우
    if ((isAnonymous && !userSpace) || (isAnonymous && userSpace.spaceRole.role_type !== 2))
      throw new BadRequestException('익명 댓글 작성 권한이 없습니다.');

    // 댓글 생성
    return await this.chatRepository.save({
      post_id: postId,
      user_id: userId,
      content,
      is_anonymous: isAnonymous,
    });
  }

  /** 답글 생성하기 */
  async createChatReplyData(userId: number, spaceId: number, postId: number, chatId: number, content: string, isAnonymous: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 게시글 id 확인
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('존재하지 않는 게시글입니다.');

    // 댓글 id 확인
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new BadRequestException('존재하지 않는 댓글입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인
    const [userSpace, userChatViewLog] = await Promise.all([
      this.userSpaceRepository
        .createQueryBuilder('userSpace')
        .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
        .where('userSpace.user_id = :userId', { userId })
        .andWhere('userSpace.space_id = :spaceId', { spaceId })
        .innerJoin('userSpace.spaceRole', 'role')
        .getOne(),
      this.userViewLogRepository.findOne({ where: { user_id: userId, post_id: postId, type_id: 1 } }),
    ]);

    if (!userChatViewLog) {
      // chat 생성 로그 정보 생성(비동기 처리)
      // job_id(0: 읽음, 1: 게시글 업데이트 || 댓글 추가)
      // type_id(0: 게시글 관련 로그, 1: 댓글 관련 로그)
      this.userViewLogRepository.save({
        user_id: userId,
        post_id: postId,
        job_id: 1,
        type_id: 1,
      });
    }

    if (userChatViewLog && userChatViewLog?.job_id === 0) {
      // chat 조회 로그 정보를 '읽음'으로 수정(비동기 처리)
      this.userViewLogRepository.update(
        {
          user_id: userId,
          post_id: postId,
          type_id: 1,
        },
        {
          job_id: 1,
        },
      );
    }

    // 공간 구성원이 아닌 유저가 익명 답글을 작성하는 경우
    // 관리자가 및 개설자가 익명 답글을 작성하는 경우
    // 0: 개설자, 1: 관리자 2: 참여자
    if ((isAnonymous && !userSpace) || (isAnonymous && userSpace.spaceRole.role_type !== 2))
      throw new BadRequestException('익명 답글 작성 권한이 없습니다.');

    // 답글 생성
    return await this.chatRepository.save({
      post_id: postId,
      user_id: userId,
      content,
      is_anonymous: isAnonymous,
      chat_id: chatId,
    });
  }

  /** 댓글(답글) 삭제하기 */
  async destroyChatData(userId: number, spaceId: number, postId: number, chatId: number) {
    // 공간 id 확인
    const space = await this.spaceRepository.findOne({ where: { id: spaceId } });
    if (!space) throw new BadRequestException('존재하지 않는 공간 정보입니다.');

    // 게시글 id 확인
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new BadRequestException('존재하지 않는 게시글 정보입니다.');

    // 댓글 id 확인
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) throw new BadRequestException('존재하지 않는 댓글 정보입니다.');

    // 권한(개설자, 관리자, 참여자) 여부 확인
    const userSpace = await this.userSpaceRepository
      .createQueryBuilder('userSpace')
      .select(['userSpace.id', 'userSpace.user_id', 'userSpace.space_id', 'role.role_type'])
      .where('userSpace.user_id = :userId', { userId })
      .andWhere('userSpace.space_id = :spaceId', { spaceId })
      .innerJoin('userSpace.spaceRole', 'role')
      .getOne();

    // 공간 참여 유저가 아니며 작성자도 아닌 경우 || 공간 참여 유저지만 작성자가 아닌 경우
    // 0: 개설자, 1: 관리자 2: 참여자
    if ((!userSpace && userId !== chat.user_id) || (userSpace && userSpace.spaceRole.role_type === 2 && userId !== chat.user_id))
      throw new BadRequestException('관리자 혹은 작성자만 댓글 삭제가 가능합니다.');

    return await this.chatRepository.softDelete({ id: chatId });
  }
}
