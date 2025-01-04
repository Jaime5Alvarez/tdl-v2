import { relations } from "drizzle-orm/relations";
import { users, tasks } from "./schema";

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

export const tasksRelations = relations(tasks, ({one}) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
}));