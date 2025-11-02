import type { H3Event } from 'h3'

export async function requireTeam(event: H3Event): Promise<{
  user: {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
  }
  team: {
    organization: Organization
  }
}> {
  const sessionData = await serverAuth().api.getSession({
    headers: getHeaders(event) as any
  })

  if (!sessionData?.session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { user } = sessionData
  const activeOrganizationId = getCookie(event, 'activeOrganizationId')

  if (!activeOrganizationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No team selected'
    })
  }

  const member = await db.query.member.findFirst({
    where: (member, { eq }) => and(
      eq(member.organizationId, activeOrganizationId),
      eq(member.userId, user.id)
    ),
    with: {
      organization: true
    }
  })

  if (!member) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Team not found'
    })
  }

  return {
    user,
    team: {
      organization: member.organization
    }
  }
}
