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
      throw new BadRequestException('This email is already registered');
    }

    const existingUserName = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });
    if (existingUserName) {
      throw new BadRequestException('Username already taken');
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
    return {
      accessToken: await this.signToken({
        sub: user.id,
        email: user.email,
        guest: false,
      }),
      user,
    };
  }

  async login(dto: UserLogin) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    console.log('////////////////////', user);
    if (!user || !user.password || !user.email) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    console.log(passwordMatches);
    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      accessToken: await this.signToken({
        sub: user.id,
        email: user.email,
        guest: false,
      }),
      user,
    };
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

    return {
      accessToken: await this.signToken({
        sub: user.id,
        guest: true,
      }),
    };
  }

  private async signToken(payload: any): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }
}
