export class UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;

  constructor(data: Partial<{
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
  }>) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate;
    this.completed = data.completed;
  }
} 