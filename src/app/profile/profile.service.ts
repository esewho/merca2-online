import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        address: true,
        phone: true,
      },
    });
  }

  async updateUserProfile(userId: string, dto: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }
}
