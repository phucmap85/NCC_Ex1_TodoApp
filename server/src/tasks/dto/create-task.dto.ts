export class CreateTaskDto {
  readonly name: string;
  readonly status: string;
  readonly assignee: string[];
}