import Toucan from 'toucan-js'
import app from './app'
import { Bindings, InitialEnv } from './types'

export default {
  fetch(
    request: Request,
    env: InitialEnv,
    ctx: ExecutionContext,
  ): Promise<Response> | Response {
    const SENTRY = new Toucan({
      dsn: env.SENTRY_DSN,
      context: ctx,
      request: request,
      allowedHeaders: ['User-Agent'],
      allowedSearchParams: /(.*)/,
    })
    const bindings: Bindings = {
      SENTRY: SENTRY,
      ...env,
    }
    try {
      return app.fetch(request, bindings, ctx)
    } catch (err) {
      SENTRY.captureException(err)
      return new Response('Something went wrong', {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }
  },
}
