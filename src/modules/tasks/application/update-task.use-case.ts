import { TaskRepository } from '../infrastructure/task-repository';
import { UpdateTaskDto } from '../domain/dto/update-task.dto';
import { Task } from '../domain/entities/task';
export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.taskRepository.update(id, updateTaskDto);
  }
} 