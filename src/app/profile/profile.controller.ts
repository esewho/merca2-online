import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../common/decorators/user-id.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@UserId() userId: string) {
    return await this.profileService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMyProfile(
    @UserId() userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.profileService.updateUserProfile(userId, dto);
  }
}
