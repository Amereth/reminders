import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { User } from '@supabase/supabase-js'

export type Ctx = {
  user: User
}

const ctxPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.decorateRequest('ctx', {} as Ctx)

  done()
}

export default fastifyPlugin(ctxPlugin, {
  name: 'ctx',
})

declare module 'fastify' {
  interface FastifyRequest {
    ctx: Ctx
  }
}
