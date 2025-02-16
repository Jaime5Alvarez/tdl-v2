export class UpdateTaskDto {
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  constructor(data: {
    title: string;
    description?: string;
    date: string;
    completed: boolean;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.date = new Date(data.date).toISOString();
    this.completed = data.completed;
  }
}