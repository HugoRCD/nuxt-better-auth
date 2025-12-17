import { fileURLToPath } from 'node:url'
import { applyDatabaseMigrations, applyDatabaseQueries } from '@nuxthub/core/db'
import { db } from 'hub:db'
import { dirname, resolve } from 'pathe'

export default defineEventHandler(async () => {
  const { hub } = useRuntimeConfig()

  const serverDir = dirname(fileURLToPath(import.meta.url))

  const prodHubConfig = {
    ...hub,
    dir: resolve(serverDir, '..')
  }

  await applyDatabaseMigrations(prodHubConfig as any, db)
  await applyDatabaseQueries(prodHubConfig as any, db)

  return { result: 'Migrations applied' }
})
