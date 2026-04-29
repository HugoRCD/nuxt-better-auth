import { pgTable, text, timestamp, boolean, bigint } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// TODO: will be fixed in upcoming nuxthub version
// @ts-expect-error cannot import with .ts extension
import { user, organization } from './auth.ts'

export const notes = pgTable('notes', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  done: boolean('done').notNull().default(false),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(user, {
    fields: [notes.userId],
    references: [user.id]
  }),
  organization: one(organization, {
    fields: [notes.organizationId],
    references: [organization.id]
  })
}))
