import { pgTable, foreignKey, uuid, text } from "drizzle-orm/pg-core"

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
