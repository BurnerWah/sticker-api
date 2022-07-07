import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

app.use('*', etag(), logger(), prettyJSON(), cors({ origin: '*' }))

export default app
