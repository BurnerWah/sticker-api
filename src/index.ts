export interface Env {
  NAME_ALIASES: KVNamespace
  STICKER_ALIASES: KVNamespace
  PACK_METADATA: KVNamespace
  STICKERS_R2: R2Bucket
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return new Response('Hello World!')
  },
}
