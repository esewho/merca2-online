import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/dtos/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLogin } from 'src/dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: User) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hahshedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hahshedPassword,
      },
      select: { id: true, email: true, name: true },
    });
    return { accessToken: await this.signToken(user.id, user.email) };
  }

  async login(dto: UserLogin) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.password || !user.email) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials');
    }

    return { accessToken: await this.signToken(user.id, user.email) };
  }

  async loginGuest(guestId: string) {
    let user = await this.prisma.user.findUnique({
      where: { guestId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { guestId },
      });
    }

    return { accessToken: await this.signToken(user.id) };
  }

  private async signToken(userId: string, email?: string | null) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload);
    return accessToken;
  }
}
