import { User } from "src/users/schemas/user.schema";

export class UpdateTaskDto {
  readonly name: string;
  readonly status: string;
  readonly assignee: User[];
}