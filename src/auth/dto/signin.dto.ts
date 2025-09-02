import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'password123!' })
  password: string;
}
