export { sql, eq, and, or } from 'drizzle-orm'

export type Note = typeof schema.notes.$inferSelect
export type User = typeof schema.user.$inferSelect
export type Organization = typeof schema.organization.$inferSelect
