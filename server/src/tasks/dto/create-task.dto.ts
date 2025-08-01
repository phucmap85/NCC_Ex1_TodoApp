import { User } from "src/users/schemas/user.schema";

export class CreateTaskDto {
  readonly name: string;
  readonly status: string;
  readonly assignee: User[];
}