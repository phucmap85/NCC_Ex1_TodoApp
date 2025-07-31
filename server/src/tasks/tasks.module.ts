import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskSchema } from './schemas/task.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'tasks', schema: TaskSchema }]),
            MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
