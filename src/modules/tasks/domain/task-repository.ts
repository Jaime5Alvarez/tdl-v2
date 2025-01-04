import { Task } from './task';

export interface TaskRepository {
  create(task: Omit<Task, 'id'>): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  markAsComplete(id: string): Promise<Task>;
  markAsIncomplete(id: string): Promise<Task>;
} 