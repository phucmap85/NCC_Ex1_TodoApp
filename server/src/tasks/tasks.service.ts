import { Injectable, HttpException } from '@nestjs/common';
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

  async taskVaidation(taskDto: CreateTaskDto | UpdateTaskDto): Promise<void> {
    // Task name validation
    if(!taskDto['name'] || taskDto['name'].length === 0) {
      throw new HttpException('Task name is required', 400);
    }
    if(taskDto['name'].length < 3 || taskDto['name'].length > 50) {
      throw new HttpException('Task name must be between 3 and 50 characters', 400);
    }

    // Status validation
    if(!taskDto['status'] || taskDto['status'].length === 0) {
      throw new HttpException('Task status is required', 400);
    }
    if(!["todo", "doing", "done"].includes(taskDto['status'])) {
      throw new HttpException('Task status not found', 400);
    }

    // Assignee validation
    if(!taskDto['assignee']) {
      throw new HttpException('Task assignee field is required', 400);
    }
    for(const user of taskDto['assignee']) {
      // Check if the user exists
      try {
        await this.userModel.findById(user._id).exec();
      } catch (error) {
        throw new HttpException('One or more assignees not found', 404);
      }
    }
  }
  
  async create(createTaskDto: CreateTaskDto): Promise<Task> {  
    // Validate the task
    await this.taskVaidation(createTaskDto);

    for(const user of createTaskDto['assignee']) {
      // Check if the user exists and matches the provided fields
      const userExists = await this.userModel.findById(user._id).exec();

      if(userExists) {
        for(const key in user) {
          if(key.toString() === '_id' || key.toString() === '__v') continue;
          if(key.toString() === 'numberOfTasks') continue;
          
          if(!userExists[key] || userExists[key].toString() !== user[key].toString()) {
            throw new HttpException(`One or more assignee fields do not match`, 400);
          }
        }
      } else {
        throw new HttpException('One or more assignees not found', 404);
      }
    }
    
    // Create the task
    try {
      const createdTask = await this.taskModel.create(createTaskDto);

      // Update the number of tasks for each assignee
      if(createdTask['status'] === "doing" || createdTask['status'] === "todo") {
        createdTask['assignee'].forEach((user: User) => {
          this.userModel.findByIdAndUpdate(
            user._id, { $inc: { numberOfTasks: 1 } }, { new: true }
          ).exec();
        });
      }

      return createdTask;
    } catch (error) {
      throw new HttpException('Error creating task', 500);
    }
  }

  async findByStatus(status: string): Promise<Task[]> {
    // Task status validation
    if(!status || status.length === 0) {
      throw new HttpException('Task status is required', 400);
    }
    if(!["todo", "doing", "done"].includes(status)) {
      throw new HttpException('Task status not found', 400);
    }

    // Find tasks by status
    try {
      return await this.taskModel.find({status: { $in: status }}).exec();
    } catch (error) {
      throw new HttpException('Error fetching tasks by status', 500);
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskModel.find().exec();
    } catch (error) {
      throw new HttpException('Error fetching tasks', 500);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    // Validate the task
    await this.taskVaidation(updateTaskDto);

    // Check if the user exists and matches the provided fields
    for(const user of updateTaskDto['assignee']) {
      try {
        const userExists = await this.userModel.findById(user._id).exec();

        if(userExists) {
          for(const key in user) {
            if(key.toString() === '_id' || key.toString() === '__v') continue;
            if(key.toString() === 'numberOfTasks') continue;
            
            if(!userExists[key] || userExists[key].toString() !== user[key].toString()) {
              throw new HttpException(`One or more assignee fields do not match`, 400);
            }
          }
        } else {
          throw new HttpException('One or more assignees not found', 404);
        }
      } catch (error) {
        throw new HttpException('One or more assignees not found', 404);
      }
    }
    
    // Update the task
    try {
      const updateNumberOfTasks = async (userId: string, increment: number) => {
        try {
          return await this.userModel.findByIdAndUpdate(
            userId, { $inc: { numberOfTasks: increment } }, { new: true }
          ).exec();
        } catch (error) {
          throw new HttpException('One or more assignees not found', 404);
        }
      };

      const existingTask = await this.taskModel.findById(id).exec();

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
    } catch (error) {
      throw new HttpException('Task not found', 404);
    }
    
    try {
      return await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();
    } catch (error) {
      throw new HttpException('Error updating task', 500);
    }
  }

  async delete(id: string): Promise<Task | null> {
    try {
      const deletedTask = await this.taskModel.findById(id).exec();

      if (deletedTask && (deletedTask['status'] === "doing" || deletedTask['status'] === "todo")) {
        for (const user of deletedTask['assignee']) {
          const userExists = await this.userModel.findById(user._id).exec();

          // check if numberOfTasks is bigger than 0
          if (userExists && userExists['numberOfTasks'] <= 0) {
            throw new HttpException('User\'s number of tasks cannot be equal or less than 0', 400);
          }
          
          await this.userModel.findByIdAndUpdate(
            user._id, { $inc: { numberOfTasks: -1 } }, { new: true }
          ).exec();
        }
      }

      try {
        return await this.taskModel.findByIdAndDelete(id).exec();
      } catch (error) {
        throw new HttpException('Error deleting task', 500);
      }
    } catch (error) {
      throw new HttpException('Task not found', 404);
    }
  }
}
