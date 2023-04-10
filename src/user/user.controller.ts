import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { AuthResponseDto } from './dto/auth.response.dto';
import { signupRequestDto } from './dto/join.request.dto';
import { loginRequestDto } from './dto/login.request.dto';
import { UserRequestDto } from './dto/user.response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: { properties: { success: { type: 'boolean', example: true }, result: { type: 'array', example: '{success: true, result: [{}]}' } } },
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'access_token',
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '유저 프로필 조회' })
  @UseGuards(AtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    const result = await this.userService.findAllUsers();
    return { success: true, data: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: UserRequestDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  async createUser(@Body() body: signupRequestDto) {
    const result = await this.userService.createUserData(body.email, body.password, body.first_name, body.last_name);
    return { success: true, data: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: AuthResponseDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async singIn(@Body() body: loginRequestDto) {
    const result = await this.userService.signIn(body.email, body.password);
    return { success: true, data: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: AuthResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'refresh_token',
    required: true,
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'jwt tokens 재발급' })
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser() currentUser: string) {
    const result = await this.userService.refreshTokens(userId, currentUser['refreshToken']);
    return { success: true, data: result };
  }
}
