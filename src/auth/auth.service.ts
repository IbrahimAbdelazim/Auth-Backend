import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const createdUser = await this.userService.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    const tokenPayload = {
      sub: createdUser._id,
      email: createdUser.email,
    };
    const token = await this.jwtService.signAsync(tokenPayload);

    return { access_token: token };
  }
}
