import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserLogin } from 'src/dtos/user-login.dto';
import { User } from 'src/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: User): Promise<{ accessToken: string }> {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: UserLogin): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }

  @Post('login-guest')
  async loginGuest(
    @Body('guestId') guestId: string,
  ): Promise<{ accessToken: string }> {
    return await this.authService.guestLogin(guestId);
  }
}
