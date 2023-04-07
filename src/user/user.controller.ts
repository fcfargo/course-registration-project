import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { joinRequestDto } from './dto/join.request.dto';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.findAllUsers();
  }

  @Post()
  async createUser(@Body() body: joinRequestDto) {
    return await this.userService.createUserData(body.email, body.password, body.first_name, body.last_name);
  }
}
