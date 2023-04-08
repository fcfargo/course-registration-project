import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';
import { AtGuard, RtGuard } from 'src/common/guards';
import { joinRequestDto } from './dto/join.request.dto';
import { loginRequestDto } from './dto/login.request.dto';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return await this.userService.findAllUsers();
  }

  @Post('singup')
  async createUser(@Body() body: joinRequestDto) {
    const result = await this.userService.createUserData(body.email, body.password, body.first_name, body.last_name);
    return { success: true, data: result };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async singIn(@Body() body: loginRequestDto) {
    const result = await this.userService.signIn(body.email, body.password);
    return { success: true, data: result };
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser() currentUser: string) {
    const result = await this.userService.refreshTokens(userId, currentUser['refreshToken']);
    return { success: true, data: result };
  }
}
