import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /** 데이터 해싱 */
  async hashData(data: string) {
    return await bcrypt.hash(data, 12);
  }

  /** jwt 토큰(acces_token, refresh_token) 생성하기*/
  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.ACCESSTOKEN_SECRET_KEY,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.REFRESHTOKEN_SECRET_KEY,
          expiresIn: '30d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  /** 유저 정보 가져오기 */
  async findAllUsers() {
    return this.userRepository.find({ select: ['first_name', 'last_name', 'profile_url'] });
  }

  /** 유저 정보 생성하기 */
  async createUserData(email: string, password: string, firstName: string, lastName: string) {
    // email 중복 확인
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }

    // bcrypt 암호화
    const hashedPassword = await this.hashData(password);

    // 유저 정보 생성
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    });

    // jwt 토큰 생성
    const tokens = await this.getTokens(newUser.id, newUser.email);

    // refreshTokenHash 업데이트
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);

    const { createdAt, deletedAt, refresh_token_hash, ...result } = newUser;
    delete result.password;

    return { ...result, tokens };
  }

  /** 유저 인증하기 */
  async signIn(email: string, password: string) {
    // email 일치 여부 확인
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('존재하지 않는 email 정보입니다.');

    // 비밀번호 일치 여부 확인
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new BadRequestException('비밀번호가 올바르지 않습니다.');

    // jwt 토큰 생성
    const tokens = await this.getTokens(user.id, user.email);

    // refreshTokenHash 업데이트
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return { tokens };
  }

  /** tokens 재발급 */
  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('존재하지 않는 유저입니다.');

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!refreshTokenMatches) throw new BadRequestException('refresh_token 불일치');

    // jwt 토큰 생성
    const tokens = await this.getTokens(user.id, user.email);

    // refreshTokenHash 업데이트
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  /** refreshTokenHash 업데이트 */
  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const refreshTokenHash = await this.hashData(refreshToken);
    return await this.userRepository.update({ id: userId }, { refresh_token_hash: refreshTokenHash });
  }
}
