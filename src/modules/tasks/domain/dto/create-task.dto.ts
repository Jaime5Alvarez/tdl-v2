export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: Date;
  userId: string;

  constructor(data: {
    title: string;
    description?: string;
    dueDate?: Date;
    userId: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate;
    this.userId = data.userId;
  }

  static create(data: {
    title: string;
    description?: string;
    dueDate?: Date;
    userId: string;
  }): CreateTaskDto {
    return new CreateTaskDto(data);
  }
} 