import { InferSelectModel } from "drizzle-orm";
import { users } from "src/modules/database/infrastructure/drizzle/schema";

export type User = InferSelectModel<typeof users>;
