export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string | null;
  constructor(data: {
    title: string;
    description?: string;
    dueDate?: Date | string | null;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
  }
}