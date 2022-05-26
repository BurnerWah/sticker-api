import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', etag(), logger())

// Special API route to assist with site-level support
app.get('/sticker/:name', async (ctx) => {
  const character = ctx.req.header('X-Sticker-Character')
  const { name } = ctx.req.param()
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

// Primary API route
app.get('/sticker/:character/:sticker', async (ctx) => {
  const header_char = ctx.req.header('X-Sticker-Character')
  if (header_char) return ctx.text('No', 403)

  let character = ctx.req.param('character')
  const character_alias = NAME_ALIASES.get(character)

  const sticker = ctx.req.param('sticker')

  await character_alias.then((alias) => {
    if (alias) character = alias
  })

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
