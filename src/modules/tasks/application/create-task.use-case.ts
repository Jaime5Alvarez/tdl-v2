import { TaskRepository } from '../infrastructure/task-repository';
import { CreateTaskDto } from '../domain/dto/create-task.dto';
import { Task } from '../domain/entities/task';
import { GetUserInfoUseCase } from '@/modules/user/application/get-user-info.use-case';
import { SupabaseUserRepository } from '@/modules/user/infraestructure/supabase/user-repository';
import { createClient } from '@/utils/supabase/server';

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(createTaskDto: CreateTaskDto): Promise<Task> {
    const supabase = await createClient();
    const user = await new GetUserInfoUseCase(new SupabaseUserRepository(supabase)).execute();
    if (!user) {
      throw new Error("User not found");
    }
    return await this.taskRepository.create(createTaskDto, user.id);
  }
} 