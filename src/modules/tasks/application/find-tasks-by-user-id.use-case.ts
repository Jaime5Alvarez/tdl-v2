import { Task } from '@/modules/database/infrastructure/drizzle/schema';
import { TaskRepository } from '../domain/task-repository';

export class FindTasksByUserIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId);
  }
} 