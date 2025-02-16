import { TaskRepository } from '../infrastructure/task-repository';
import { Task } from '../domain/entities/task';
export class FindTasksByUserIdAndDateUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string, date: Date): Promise<Task[]> {
    return await this.taskRepository.findByUserIdAndDate(userId, date);
  }
} 