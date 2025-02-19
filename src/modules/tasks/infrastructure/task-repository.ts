import { CreateTaskDto } from "../domain/dto/create-task.dto";
import { UpdateTaskDto } from "../domain/dto/update-task.dto";
import { Task } from "../domain/entities/task";
export interface TaskRepository {
  create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
  update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByUserIdAndDate(userId: string, date: Date): Promise<Task[]>;
} 