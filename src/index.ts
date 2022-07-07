import app from './app'

export interface Env {
  NAME_ALIASES: KVNamespace
  STICKER_ALIASES: KVNamespace
  PACK_METADATA: KVNamespace
  STICKERS_R2: R2Bucket
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx)
  },
}
