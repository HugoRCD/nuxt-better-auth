import { betterAuth } from 'better-auth'
import { anonymous, admin, organization } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, schema } from 'hub:database'

let _auth: ReturnType<typeof betterAuth>

export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
      database: drizzleAdapter(
        db,
        {
          provider: 'pg',
          schema
        }
      ),
      secondaryStorage: {
        get: async (key) => {
          return await useStorage('auth').getItemRaw(`_auth:${key}`)
        },
        set: async (key, value, ttl) => {
          return await useStorage('auth').setItem(`_auth:${key}`, value, { ttl })
        },
        delete: async (key) => {
          await useStorage('auth').removeItem(`_auth:${key}`)
        }
      },
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
      },
      user: {
        deleteUser: {
          enabled: true
        },
      },
      plugins: [anonymous(), admin(), organization()],
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
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    } catch (e) { /* empty */ }
  }
  return baseURL
}

_auth = serverAuth()

export const auth = _auth!
