import { IsNotEmpty, IsString } from 'class-validator';

export class UserLogin {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  password: string;
}
