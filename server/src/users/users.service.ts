import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async userVaidation(userDto: CreateUserDto | UpdateUserDto): Promise<void> {
    // Username validation
    if (!userDto['username'] || userDto['username'].length === 0) {
      throw new HttpException('Username is required', 400);
    }
    if (userDto['username'].length < 3 || userDto['username'].length > 20) {
      throw new HttpException('Username must be between 3 and 20 characters', 400);
    }
    if (!/^[a-zA-Z0-9_]+$/.test(userDto['username'])) {
      throw new HttpException('Username can only contain letters, numbers, and underscores', 400);
    }
    if (userDto['username'].includes(' ')) {
      throw new HttpException('Username cannot contain spaces', 400);
    }

    // Email validation
    if (!userDto['email'] || userDto['email'].length === 0) {
      throw new HttpException('Email is required', 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDto['email'])) {
      throw new HttpException('Invalid email format', 400);
    }

    // Fullname validation
    if (!userDto['fullName'] || userDto['fullName'].length === 0) {
      throw new HttpException('Fullname is required', 400);
    }
    if (userDto['fullName'].length < 3 || userDto['fullName'].length > 50) {
      throw new HttpException('Fullname must be between 3 and 50 characters', 400);
    }
    if (userDto['fullName'].includes('  ')) {
      throw new HttpException('Fullname cannot contain multiple spaces', 400);
    }

    // Gender validation
    if (!userDto['gender'] || userDto['gender'].length === 0) {
      throw new HttpException('Gender is required', 400);
    }
    if (!['male', 'female'].includes(userDto['gender'].toLowerCase())) {
      throw new HttpException('Gender must be male or female', 400);
    }

    // Year of birth validation
    if (!userDto['yearOfBirth']) {
      throw new HttpException('Year of birth is required', 400);
    }
    if (typeof userDto['yearOfBirth'] !== 'number' || !Number.isInteger(userDto['yearOfBirth'])) {
      throw new HttpException('Year of birth must be a valid integer', 400);
    }
    if (userDto['yearOfBirth'] < 1900 || userDto['yearOfBirth'] > new Date().getFullYear()) {
      throw new HttpException('Year of birth must be a valid year', 400);
    }

    // Number of tasks validation
    if (userDto['numberOfTasks'] === undefined || userDto['numberOfTasks'] === null) {
      throw new HttpException('Number of tasks is required', 400);
    }
    if (typeof userDto['numberOfTasks'] !== 'number' || 
        !Number.isInteger(userDto['numberOfTasks']) || 
        userDto['numberOfTasks'] < 0) {
      throw new HttpException('Number of tasks must be a non-negative integer', 400);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Validate the user
    await this.userVaidation(createUserDto);

    // Check if the username already exists
    const existingUsername = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (existingUsername) {
      throw new HttpException('Username already exists', 400);
    }

    // Check if the email already exists
    const existingEmail = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingEmail) {
      throw new HttpException('Email already exists', 400);
    }

    try {
      return await this.userModel.create(createUserDto);
    }
    catch (error) {
      throw new HttpException('Error creating user', 500);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new HttpException('Error fetching users', 500);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // Validate the user
    await this.userVaidation(updateUserDto);

    // Check if the user exists
    try {
      await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('User not found', 404);
    }

    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    } catch (error) {
      throw new HttpException('Error updating user', 500);
    }
  }

  async delete(id: string): Promise<User | null> {
    // Check if the user exists
    try {
      await this.userModel.findById(id).exec();
    } catch (error) {
      throw new HttpException('User not found', 404);
    }

    try {
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new HttpException('Error deleting user', 500);
    }
  }
}
