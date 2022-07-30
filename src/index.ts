import Toucan from 'toucan-js'
import app from './app'

export default {
  fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> | Response {
    const sentry = new Toucan({
      dsn: env.SENTRY_DSN,
      context: ctx,
      request: request,
      allowedHeaders: ['User-Agent'],
      allowedSearchParams: /(.*)/,
    })
    try {
      return app.fetch(request, env, ctx)
    } catch (err) {
      sentry.captureException(err)
      return new Response('Something went wrong', {
        status: 500,
        statusText: 'Internal Server Error',
      })
    }
  },
}
