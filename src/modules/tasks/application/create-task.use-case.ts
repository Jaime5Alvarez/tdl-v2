import { TaskRepository } from '../infrastructure/task-repository';
import { CreateTaskDto } from '../domain/dto/create-task.dto';
import { Task } from '../domain/entities/task';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.create(createTaskDto);
  }
} 