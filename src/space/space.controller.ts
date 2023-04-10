import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { CreateSpaceRequestDto } from './dto/create.request.dto';
import { joinSpaceRequestDto } from './dto/join.request.dto';
import { joinSpaceResponseDto } from './dto/join.response.dto';
import { SpaceResponseDto } from './dto/space.response.dto';
import { SpaceService } from './space.service';

@ApiTags('Space')
@ApiHeader({
  name: 'Authorization',
  description: 'access_token',
  required: true,
})
@UseGuards(AtGuard)
@Controller('api/spaces')
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: SpaceResponseDto,
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '유저 공간 개설' })
  @Post()
  async createSpace(@Body() body: CreateSpaceRequestDto, @GetCurrentUserId() userId: number) {
    const result = await this.spaceService.createSpaceData(userId, body.name, body.logo_url);
    return { success: true, data: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: joinSpaceResponseDto,
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '유저 공간 참여' })
  @Post(':spaceId/:spaceRoleId')
  @HttpCode(HttpStatus.OK)
  async joinSpace(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('spaceRoleId', ParseIntPipe) spaceRoleId: number,
    @Body() body: joinSpaceRequestDto,
  ) {
    const result = await this.spaceService.createSpaceMemberData(userId, spaceId, spaceRoleId, body.entranceCode);
    return { success: true, data: result };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: { properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'DELETE CLEAR' } } },
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '유저 공간 삭제' })
  @Delete(':spaceId')
  @HttpCode(HttpStatus.OK)
  async deleteSpace(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number) {
    await this.spaceService.destroySpaceData(userId, spaceId);
    return { success: true, message: 'DELETE CLEAR' };
  }

  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiResponse({
    status: 200,
    description: '성공',
    schema: { properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'DELETE CLEAR' } } },
  })
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: '유저 공간 역할 삭제' })
  @Delete(':spaceId/:spaceRoleId')
  @HttpCode(HttpStatus.OK)
  async deleteSpaceRole(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('spaceRoleId', ParseIntPipe) spaceRoleId: number,
  ) {
    await this.spaceService.destroySpaceRoleData(userId, spaceId, spaceRoleId);
    return { success: true, message: 'DELETE CLEAR' };
  }
}
