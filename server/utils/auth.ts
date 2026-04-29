import { betterAuth } from 'better-auth'
import { anonymous, admin, organization } from 'better-auth/plugins'
import { dash } from '@better-auth/infra'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, schema } from '@nuxthub/db'

export const auth = betterAuth({
  database: drizzleAdapter(
    db,
    {
      provider: 'pg',
      schema
    }
  ),
  baseURL: getBaseURL(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
    storeStateStrategy: 'cookie',
  },
  user: {
    deleteUser: {
      enabled: true
    },
  },
  plugins: [anonymous(), admin(), organization(), dash()],
  databaseHooks: {
    session: {
      create: {
        before: (session) => {
          const event = useEvent()
          const activeOrganizationId = getCookie(event, 'activeOrganizationId')

          return Promise.resolve({
            data: {
              ...session,
              activeOrganizationId
            }
          })
        }
      },
    },
  },
})

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    } catch (e) { /* empty */ }
  }
  return baseURL
}
