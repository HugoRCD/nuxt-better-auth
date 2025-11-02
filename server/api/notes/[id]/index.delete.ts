export default eventHandler(async (event) => {
  const { user, team } = await requireTeam(event)
  const id = parseInt(getRouterParam(event, 'id') as string)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid note ID'
    })
  }

  const { notes } = schema

  const deletedNote = await db
    .delete(notes)
    .where(
      and(
        eq(notes.id, id),
        eq(notes.organizationId, team.organization.id),
        eq(notes.userId, user.id)
      )
    )
    .returning()

  if (!deletedNote.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Note not found or access denied'
    })
  }

  return { success: true }
})
