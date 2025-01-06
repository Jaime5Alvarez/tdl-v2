export class UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string | null;
  completed?: boolean;

  constructor(data: Partial<{
    title: string;
    description: string;
    dueDate: Date | string | null;
    completed: boolean;
  }>) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
    this.completed = data.completed;
  }
} 