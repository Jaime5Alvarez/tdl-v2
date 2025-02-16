export class CreateTaskDto {
  title: string;
  description?: string;
  date: string;
  constructor(data: {
    title: string;
    description?: string;
    date: string;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.date = new Date(data.date).toISOString();
  }
}