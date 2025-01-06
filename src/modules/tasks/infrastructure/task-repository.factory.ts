import { DatabaseService } from '@/modules/database/application/database-service';
import { DrizzleTaskRepository } from './drizzle/drizzle-task-repository';
import { TaskRepository } from './task-repository';

export function TaskRepositoryFactory(): TaskRepository {
  const dbService = DatabaseService.getInstance();
  return new DrizzleTaskRepository(dbService.getConnection());
} 