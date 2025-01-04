import { Task } from '@/modules/database/infrastructure/drizzle/schema';
import { TaskRepository } from '../domain/task-repository';

export class FindTaskByIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }
} 