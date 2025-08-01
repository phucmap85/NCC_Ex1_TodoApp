import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop()
  name: string;

  @Prop()
  status: string;

  @Prop([User])
  assignee: User[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);