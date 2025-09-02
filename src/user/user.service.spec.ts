/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User, UserType } from './user.schema';
import { CreateUserInterface } from './interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<Model<UserType>>;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserInterface = {
        email: 'newuser@example.com',
        password: 'hashedPassword',
        name: 'New User',
      };

      userModel.create.mockResolvedValue(mockUser as any);

      const result = await service.createUser(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should propagate database errors', async () => {
      const createUserDto: CreateUserInterface = {
        email: 'newuser@example.com',
        password: 'hashedPassword',
        name: 'New User',
      };
      const error = new Error('Database error');

      userModel.create.mockRejectedValue(error);

      await expect(service.createUser(createUserDto)).rejects.toThrow(error);
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email without password by default', async () => {
      const email = 'test@example.com';
      const { password: _, ...userWithoutPassword } = mockUser;

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(userWithoutPassword),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(userWithoutPassword);
    });

    it('should find user by email with password when selectPassword is true', async () => {
      const email = 'test@example.com';

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.findByEmail(email, true);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).not.toHaveBeenCalled();
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      const result = await service.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockQuery.exec).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should propagate database errors', async () => {
      const email = 'test@example.com';
      const error = new Error('Database error');

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(error),
      };

      userModel.findOne.mockReturnValue(mockQuery as any);

      await expect(service.findByEmail(email)).rejects.toThrow(error);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockQuery.exec).toHaveBeenCalled();
    });
  });
});
