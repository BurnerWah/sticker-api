interface PackMetadata {
  nsfwStickers?: string[]
}

export interface Env {
  NAME_ALIASES: KVNamespace<string>
  STICKER_ALIASES: KVNamespace<string>
  PACK_METADATA: KVNamespace
  STICKERS_R2: R2Bucket
}
