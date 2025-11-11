import { Body, Controller, Get, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  async getMyProfile(userId: string) {
    return await this.profileService.getUserProfile(userId);
  }

  @Put('me')
  async updateMyProfile(userId: string, @Body() dto: UpdateProfileDto) {
    return await this.profileService.updateUserProfile(userId, dto);
  }
}
