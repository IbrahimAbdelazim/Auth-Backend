/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp and return access token', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password123!',
        name: 'Test User',
      };
      const expectedResult = { access_token: 'jwt-token' };

      authService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signupDto);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.signUp', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password123!',
        name: 'Test User',
      };
      const error = new Error('Service error');

      authService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signupDto)).rejects.toThrow(error);
      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn and return access token', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'password123!',
      };
      const expectedResult = { access_token: 'jwt-token' };

      authService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signinDto);

      expect(authService.signIn).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual(expectedResult);
    });

    it('should propagate errors from authService.signIn', async () => {
      const signinDto: SigninDto = {
        email: 'test@example.com',
        password: 'password123!',
      };
      const error = new Error('Service error');

      authService.signIn.mockRejectedValue(error);

      await expect(controller.signIn(signinDto)).rejects.toThrow(error);
      expect(authService.signIn).toHaveBeenCalledWith(signinDto);
    });
  });
});
