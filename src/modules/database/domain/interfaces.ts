import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@/modules/database/infrastructure/drizzle/schema';
export interface IDatabaseService {
  getConnection(): PostgresJsDatabase<typeof schema>;
  closeConnection(): Promise<void>;
}
