import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/modules/database/infrastructure/drizzle/schema';
import { CreateTaskDto } from '../../domain/dto/create-task.dto';
import { UpdateTaskDto } from '../../domain/dto/update-task.dto';
import { Task } from '../../domain/entities/task';
import { TaskRepository } from '../task-repository';
export class DrizzleTaskRepository implements TaskRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const [createdTask] = await this.db.insert(schema.tasks).values({
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate,
      userId: createTaskDto.userId,
    }).returning();
    return createdTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const [updatedTask] = await this.db
      .update(schema.tasks)
      .set({
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate,
      })
      .where(eq(schema.tasks.id, id))
      .returning();
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.db.query.tasks.findFirst({
      where: eq(schema.tasks.id, id)
    });
    if (!task) return null;
    return task;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const userTasks = await this.db.query.tasks.findMany({
      where: eq(schema.tasks.userId, userId)
    });
    return userTasks;
  }

  async markAsComplete(id: string): Promise<Task> {
    return this.update(id, { completed: true });
  }

  async markAsIncomplete(id: string): Promise<Task> {
    return this.update(id, { completed: false });
  }
} 