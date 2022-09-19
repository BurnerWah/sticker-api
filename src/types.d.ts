interface PackMetadata {
  nsfwStickers?: string[]
}

interface Bindings {
  NAME_ALIASES: KVNamespace<string>
  STICKER_ALIASES: KVNamespace<string>
  PACK_METADATA: KVNamespace
  STICKERS_R2: R2Bucket
  SENTRY_DSN: string
}
