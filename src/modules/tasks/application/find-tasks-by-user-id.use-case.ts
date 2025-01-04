import { TaskRepository } from '../domain/task-repository';
import { Task } from '../domain/entities/task';
export class FindTasksByUserIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    return await this.taskRepository.findByUserId(userId);
  }
} 