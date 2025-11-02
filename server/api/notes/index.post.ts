export default eventHandler(async (event) => {
  const { user, team } = await requireTeam(event)
  const { title, content } = await readBody(event)
  const { notes } = schema
  const note = await db.insert(notes).values({
    title,
    content,
    userId: user.id,
    organizationId: team.organization.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning()

  return note[0]
})
