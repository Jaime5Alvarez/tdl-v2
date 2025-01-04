import { pgTable, foreignKey, uuid, text, timestamp, date, boolean } from "drizzle-orm/pg-core"
import { InferSelectModel, sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onDelete("cascade"),
]);

export type User = InferSelectModel<typeof users>;

export const tasks = pgTable("tasks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	description: text(),
	dueDate: date("due_date"),
	completed: boolean().default(false).notNull(),
});

export type Task = InferSelectModel<typeof tasks>;
