import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  async me(@GetUser('email') email: string): Promise<UserType | null> {
    return await this.userService.findByEmail(email);
  }
}
