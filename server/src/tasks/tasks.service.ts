import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel('tasks') private readonly taskModel: Model<Task>,
              @InjectModel('users') private readonly userModel: Model<User>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = await this.taskModel.create(createTaskDto);
    return createdTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const existingTask = await this.taskModel.findById({ _id: id }).exec();

    if(existingTask) {
      existingTask['assignee'].forEach((userId: string) => {
        this.userModel.findByIdAndUpdate(
          { _id: userId },
          { $inc: { numberOfTasks: -1 } },
          { new: true }
        ).exec();
      });
      
      updateTaskDto['assignee']?.forEach((userId: string) => {
        this.userModel.findByIdAndUpdate(
          { _id: userId },
          { $inc: { numberOfTasks: +1 } },
          { new: true }
        ).exec();
      });
    }
    
    return this.taskModel
      .findByIdAndUpdate({ _id: id }, updateTaskDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Task | null> {
    const deletedTask = await this.taskModel.findById({ _id: id }).exec();

    if(deletedTask) {
      deletedTask['assignee'].forEach((userId: string) => {
        this.userModel.findByIdAndUpdate(
          { _id: userId },
          { $inc: { numberOfTasks: -1 } },
          { new: true }
        ).exec();
      });

      await this.taskModel.findByIdAndDelete({ _id: id }).exec();
    }

    return deletedTask;
  }
}
