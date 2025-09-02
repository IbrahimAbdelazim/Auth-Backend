/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserType } from './user.schema';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as UserType & { createdAt: Date; updatedAt: Date };

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('should return user profile when user exists', async () => {
      const email = 'test@example.com';

      userService.findByEmail.mockResolvedValue(mockUser);

      const result = await controller.me(email);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      const email = 'nonexistent@example.com';

      userService.findByEmail.mockResolvedValue(null);

      const result = await controller.me(email);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should propagate errors from userService.findByEmail', async () => {
      const email = 'test@example.com';
      const error = new Error('Service error');

      userService.findByEmail.mockRejectedValue(error);

      await expect(controller.me(email)).rejects.toThrow(error);
      expect(userService.findByEmail).toHaveBeenCalledWith(email);
    });
  });
});
