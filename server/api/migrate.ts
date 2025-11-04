import { getMigrations } from 'better-auth/db'

export default eventHandler(async () => {
  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)
  if (!toBeCreated.length && !toBeAdded.length) {
    return 'No migrations to run'
  }
  await runMigrations()
  return 'Database migrations ran successfully'
})
