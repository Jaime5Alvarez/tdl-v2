import { InferSelectModel } from "drizzle-orm";
import { tasks } from "src/modules/database/infrastructure/drizzle/schema";

export type Task = InferSelectModel<typeof tasks>;
