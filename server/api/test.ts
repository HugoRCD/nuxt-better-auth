import { H3Event } from 'h3'

export default defineEventHandler((event: H3Event) => {
  return auth.api.listSessions({
    // @ts-expect-error - getHeaders is not typed correctly
    headers: getHeaders(event)
  })
})
