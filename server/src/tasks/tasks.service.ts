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
    
    if(createdTask && (createdTask['status'] === "doing" || createdTask['status'] === "todo")) {
      createdTask['assignee'].forEach((user: User) => {
        this.userModel.findByIdAndUpdate(
          { _id: user._id },
          { $inc: { numberOfTasks: 1 } },
          { new: true }
        ).exec();
      });
    }

    return createdTask;
  }

  async findByTask(task: string): Promise<Task[]> {
    return this.taskModel.find({status: { $in: task }}).exec();
  }

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const existingTask = await this.taskModel.findById({ _id: id }).exec();

    const updateNumberOfTasks = async (userId: string, increment: number) => {
      return this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $inc: { numberOfTasks: increment } },
        { new: true }
      ).exec();
    };

    if(existingTask) {
      if((existingTask['status'] === "doing" || existingTask['status'] === "todo") && 
          updateTaskDto['status'] === "done") {
        existingTask['assignee'].forEach((user: User) => updateNumberOfTasks(user._id, -1));
      } 
      else if(existingTask['status'] === "done" && 
             (updateTaskDto['status'] === "doing" || updateTaskDto['status'] === "todo")) {
        updateTaskDto['assignee'].forEach((user: User) => updateNumberOfTasks(user._id, 1));
      } 
      else if((existingTask['status'] === "doing" || existingTask['status'] === "todo") && 
              (updateTaskDto['status'] === "doing" || updateTaskDto['status'] === "todo")) {
        existingTask['assignee'].forEach((user: User) => updateNumberOfTasks(user._id, -1));
        updateTaskDto['assignee'].forEach((user: User) => updateNumberOfTasks(user._id, 1));
      }
    }
    
    return this.taskModel
      .findByIdAndUpdate({ _id: id }, updateTaskDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Task | null> {
    const deletedTask = await this.taskModel.findById({ _id: id }).exec();

    if(deletedTask) {
      if(deletedTask['status'] === "doing" || deletedTask['status'] === "todo") {
        deletedTask['assignee'].forEach((user: User) => {
          this.userModel.findByIdAndUpdate(
            { _id: user._id },
            { $inc: { numberOfTasks: -1 } },
            { new: true }
          ).exec();
        });
      }

      await this.taskModel.findByIdAndDelete({ _id: id }).exec();
    }

    return deletedTask;
  }
}
