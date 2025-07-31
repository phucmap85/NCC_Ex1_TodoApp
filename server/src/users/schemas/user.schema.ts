import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  gender: string;

  @Prop()
  yearOfBirth: number;

  @Prop()
  numberOfTasks: number;
}

export const UserSchema = SchemaFactory.createForClass(User);