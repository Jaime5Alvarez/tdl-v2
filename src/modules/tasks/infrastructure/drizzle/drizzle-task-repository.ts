import { desc, eq, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/modules/database/infrastructure/drizzle/schema';
import { CreateTaskDto } from '../../domain/dto/create-task.dto';
import { UpdateTaskDto } from '../../domain/dto/update-task.dto';
import { Task } from '../../domain/entities/task';
import { TaskRepository } from '../task-repository';
export class DrizzleTaskRepository implements TaskRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) { }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const [createdTask] = await this.db.insert(schema.tasks).values({
      id: createTaskDto.id,
      title: createTaskDto.title,
      description: createTaskDto.description,
      date: createTaskDto.date,
      userId: userId,
    }).returning();
    return createdTask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const [updatedTask] = await this.db
      .update(schema.tasks)
      .set({
        ...updateTaskDto,
        date: updateTaskDto.date,
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
      where: eq(schema.tasks.id, id),
      orderBy: desc(schema.tasks.createdAt)
    });
    if (!task) return null;
    return task;
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Task[]> {
    const userTasks = await this.db
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.userId, userId), eq(schema.tasks.date, date.toISOString())))
      .orderBy(desc(schema.tasks.createdAt));
    return userTasks;
  }
} 