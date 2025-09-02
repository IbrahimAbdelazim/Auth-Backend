import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign-up' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() dto: SignupDto): Promise<{ access_token: string }> {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Sign-in' })
  @ApiBody({ type: SigninDto })
  @ApiResponse({ status: 201, description: 'User signed in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('sign-in')
  async signIn(@Body() dto: SigninDto): Promise<{ access_token: string }> {
    return this.authService.signIn(dto);
  }
}
