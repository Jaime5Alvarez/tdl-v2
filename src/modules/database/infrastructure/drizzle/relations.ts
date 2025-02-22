import { relations } from "drizzle-orm/relations";
import { users, tasks, recurrenceTasks } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	user: one(users, {
		fields: [users.id],
		references: [users.id],
		relationName: "users_id_users_id"
	}),
	users: many(users, {
		relationName: "users_id_users_id"
	}),
	tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({one, many}) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
	recurrenceTasks: many(recurrenceTasks),
}));

export const recurrenceTasksRelations = relations(recurrenceTasks, ({one}) => ({
	task: one(tasks, {
		fields: [recurrenceTasks.taskId],
		references: [tasks.id]
	}),
}));