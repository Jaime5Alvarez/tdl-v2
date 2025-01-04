import { Task } from '@/modules/database/infrastructure/drizzle/schema';
import { TaskRepository } from '../domain/task-repository';
import { UpdateTaskDto } from '../domain/dto/update-task.dto';

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.taskRepository.update(id, updateTaskDto);
  }
} 