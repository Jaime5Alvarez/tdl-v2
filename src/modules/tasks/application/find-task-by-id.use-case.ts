import { TaskRepository } from '../infrastructure/task-repository';
import { Task } from '../domain/entities/task';
export class FindTaskByIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }
} 