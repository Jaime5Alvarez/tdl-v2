import { Task } from '@/modules/database/infrastructure/drizzle/schema';
import { TaskRepository } from '../domain/task-repository';
import { CreateTaskDto } from '../domain/dto/create-task.dto';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create(createTaskDto);
  }
} 