import { Task } from '@/modules/database/infrastructure/drizzle/schema';
import { TaskRepository } from '../domain/task-repository';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Omit<Task, 'id'>): Promise<Task> {
    return await this.taskRepository.create(task);
  }
} 