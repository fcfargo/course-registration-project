import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /** 유저 정보 가져오기 */
  async findAllUsers() {
    return this.userRepository.find({ select: ['first_name', 'last_name', 'profile_url'] });
  }

  /** 유저 정보 생성하기 */
  async createUserData(email: string, password: string, first_name: string, last_name: string) {
    // email 중복 확인
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }

    // bcrypt 암호화
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword);

    // 유저 정보 생성
    const newUser = await this.userRepository.save({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const { createdAt, deletedAt, refresh_token, ...result } = newUser;
    delete result.password;
    return result;
  }
}
