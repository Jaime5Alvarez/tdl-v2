import { TaskRepository } from '../infrastructure/task-repository';

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
} 