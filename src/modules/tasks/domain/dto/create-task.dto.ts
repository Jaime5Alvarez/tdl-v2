export class CreateTaskDto {
  id: string;
  title: string;
  description?: string;
  date: string;
  constructor(data: {
    id: string;
    title: string;
    description?: string;
    date: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.date = new Date(data.date).toISOString();
  }
}