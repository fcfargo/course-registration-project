import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { createRequestDto } from './dto/create.request.dto';
import { joinRequestDto } from './dto/join.request.dto';
import { SpaceService } from './space.service';

@Controller('api/spaces')
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @UseGuards(AtGuard)
  @Post()
  async createSpace(@Body() body: createRequestDto, @GetCurrentUserId() userId: number) {
    const result = await this.spaceService.createSpaceData(userId, body.name, body.logo_url);
    return { success: true, data: result };
  }

  @UseGuards(AtGuard)
  @Post(':spaceId/:spaceRoleId')
  @HttpCode(HttpStatus.OK)
  async joinSpace(
    @GetCurrentUserId() userId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('spaceRoleId', ParseIntPipe) spaceRoleId: number,
    @Body() body: joinRequestDto,
  ) {
    const result = await this.spaceService.createSpaceMemberData(userId, spaceId, spaceRoleId, body.entranceCode);
    return { success: true, data: result };
  }

  @UseGuards(AtGuard)
  @Delete(':spaceId')
  @HttpCode(HttpStatus.OK)
  async deleteSpace(@GetCurrentUserId() userId: number, @Param('spaceId', ParseIntPipe) spaceId: number) {
    await this.spaceService.destroySpaceData(userId, spaceId);
    return { success: true, message: 'DELETE CLEAR' };
  }

  @UseGuards(AtGuard)
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