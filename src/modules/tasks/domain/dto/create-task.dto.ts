export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string | null;
  userId: string;

  constructor(data: {
    title: string;
    description?: string;
    dueDate?: Date | string | null;
    userId: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
    this.userId = data.userId;
  }
}