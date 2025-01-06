export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string | null;
  isRecurring: boolean;
  constructor(data: {
    title: string;
    description?: string;
    dueDate?: Date | string | null;
    isRecurring: boolean;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.dueDate = data.dueDate ? new Date(data.dueDate).toISOString() : null;
    this.isRecurring = data.isRecurring;
  }
}