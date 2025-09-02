/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as argon2 from 'argon2';

// Mock argon2
jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signupDto: SignupDto = {
      email: 'newuser@example.com',
      password: 'password123!',
      name: 'New User',
    };

    it('should create a new user and return access token', async () => {
      const hashedPassword = 'hashedPassword123';
      const accessToken = 'jwt-token';

      userService.findByEmail.mockResolvedValue(null);
      mockedArgon2.hash.mockResolvedValue(hashedPassword);
      userService.createUser.mockResolvedValue({
        _id: 'new-user-id',
        email: signupDto.email,
        name: signupDto.name,
        password: hashedPassword,
      } as any);
      jwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signUp(signupDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockedArgon2.hash).toHaveBeenCalledWith(signupDto.password);
      expect(userService.createUser).toHaveBeenCalledWith({
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'new-user-id',
        email: signupDto.email,
      });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw ConflictException if email already exists', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.signUp(signupDto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockedArgon2.hash).not.toHaveBeenCalled();
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123!',
    };

    it('should sign in user and return access token', async () => {
      const accessToken = 'jwt-token';

      userService.findByEmail.mockResolvedValue(mockUser as any);
      mockedArgon2.verify.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signIn(signinDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(
        signinDto.email,
        true,
      );
      expect(mockedArgon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        signinDto.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
      });
      expect(result).toEqual({ access_token: accessToken });
    });

    it('should throw BadRequestException if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(signinDto)).rejects.toThrow(
        new BadRequestException('Invalid credentials'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(
        signinDto.email,
        true,
      );
      expect(mockedArgon2.verify).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if password is invalid', async () => {
      userService.findByEmail.mockResolvedValue(mockUser as any);
      mockedArgon2.verify.mockResolvedValue(false);

      await expect(service.signIn(signinDto)).rejects.toThrow(
        new BadRequestException('Invalid credentials'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(
        signinDto.email,
        true,
      );
      expect(mockedArgon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        signinDto.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
