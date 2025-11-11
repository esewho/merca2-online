import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogin {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
