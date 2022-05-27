import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { getCharacterAlaias, getStickerAlias } from './stores'

const app = new Hono()

app.use('*', etag(), logger(), prettyJSON(), cors({ origin: '*' }))

// Special API route to assist with site-level support
app.use(
  '/sticker/:name',
  cors({
    origin: '*',
    allowHeaders: ['X-Sticker-Character'],
    allowMethods: ['GET', 'HEAD'],
  }),
)
app.get('/sticker/:name', async (ctx) => {
  const character = ctx.req.header('X-Sticker-Character')
  let { name } = ctx.req.param()

  name = await getStickerAlias(character, name).then(
    (alias: string | null) => alias || name,
  )

  const image = await STICKERS_R2.get(`${character}:${name}.webp`)
  if (image) {
    return ctx.body(image.body, 200, {
      'Content-Type': 'image/webp',
      // We cache hits for a year because for all intents and purposes, the sticker
      'Cache-Control': 'public, max-age=31536000',
    })
  }
  return ctx.text('Not found', 404)
})

app.get('/sticker/:character/details', async (ctx) => {
  let { character } = ctx.req.param()
  character = await getCharacterAlaias(character).then(
    (alias: string | null) => alias || character,
  )
  const fname_re = new RegExp(`^${character}:(.+?)\\.webp$`)

  const metadata: PackMetadata = await PACK_METADATA.get(character).then(
    (metadata: string | null) => (metadata ? JSON.parse(metadata) : {}),
  )

  const stickers = await STICKERS_R2.list({
    prefix: `${character}:`,
  }).then((R2s: R2Objects | null) =>
    (R2s?.objects || []).map((R2: R2Object) => R2.key.replace(fname_re, '$1')),
  )

  const shown_stickers = stickers.filter(
    (s: string) => !(metadata.nsfwStickers || []).includes(s),
  )

  return ctx.json(
    {
      stickers: shown_stickers,
    },
    undefined,
    {
      // Cache hits for two weeks since while this will change occasionally,
      // it won't change very often.
      'Cache-Control': 'public, max-age=1209600',
    },
  )
})

// Primary API route
app.get('/sticker/:character/:sticker', async (ctx) => {
  const header_char = ctx.req.header('X-Sticker-Character')
  if (header_char) return ctx.text('No', 403)

  let { character, sticker } = ctx.req.param()

  character = await getCharacterAlaias(character).then(
    (alias: string | null) => alias || character,
  )

  sticker = await getStickerAlias(character, sticker).then(
    (alias: string | null) => alias || sticker,
  )

  const image = await STICKERS_R2.get(`${character}:${sticker}.webp`)
  if (image) {
    return ctx.body(image.body, 200, {
      'Content-Type': 'image/webp',
      // We cache hits for a year because for all intents and purposes, the sticker
      'Cache-Control': 'public, max-age=31536000',
    })
  }
  return ctx.text('Not found', 404)
})

export async function handleEvent(event: FetchEvent): Promise<Response> {
  return app.handleEvent(event)
}
