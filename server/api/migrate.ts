import { applyDatabaseMigrations, applyDatabaseQueries } from '@nuxthub/core/db'
import { db } from 'hub:db'

export default defineEventHandler(async () => {
  const { hub } = useRuntimeConfig()

  await applyDatabaseMigrations(hub as any, db)
  await applyDatabaseQueries(hub as any, db)

  return { result: 'Migrations applied' }
})
