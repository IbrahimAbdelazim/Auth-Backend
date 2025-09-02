import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserType>) {}

  async createUser(user: CreateUserInterface): Promise<UserType> {
    const userCreated = await this.userModel.create(user);
    return userCreated;
  }

  async findByEmail(
    email: string,
    selectPassword = false,
  ): Promise<UserType | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (!selectPassword) {
      query.select('-password');
    }
    return query.exec();
  }
}
