import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[a-zA-Z]/, { message: 'password must contain at least one letter' })
  @Matches(/\d/, { message: 'password must contain at least one number' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'password must contain at least one special character',
  })
  @ApiProperty({ example: 'password123!' })
  password: string;
}
