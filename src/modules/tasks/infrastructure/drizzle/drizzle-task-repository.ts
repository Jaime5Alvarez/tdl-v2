import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { TaskRepository } from '../../domain/task-repository';
import { tasks } from '@/modules/database/infrastructure/drizzle/schema';
import { Task } from '@/modules/database/infrastructure/drizzle/schema';
export class DrizzleTaskRepository implements TaskRepository {
  constructor(private db: PostgresJsDatabase) {}

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const [createdTask] = await this.db.insert(tasks).values(task).returning();
    return createdTask as Task;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const [updatedTask] = await this.db
      .update(tasks)
      .set({ ...task })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask as Task;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, id)
    });
    return task as Task | null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const userTasks = await this.db.query.tasks.findMany({
      where: eq(tasks.id, userId)
    });
    return userTasks as Task[];
  }

  async markAsComplete(id: string): Promise<Task> {
    return this.update(id, { completed: true });
  }

  async markAsIncomplete(id: string): Promise<Task> {
    return this.update(id, { completed: false });
  }
} 