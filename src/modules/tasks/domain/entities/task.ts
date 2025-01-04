import { InferSelectModel } from "drizzle-orm";
import { tasks } from "@/modules/database/infrastructure/drizzle/schema";

export type Task = InferSelectModel<typeof tasks>;
