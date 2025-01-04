import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task";
export interface TaskRepository {
  create(createTaskDto: CreateTaskDto): Promise<Task>;
  update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  markAsComplete(id: string): Promise<Task>;
  markAsIncomplete(id: string): Promise<Task>;
} 