import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { User } from '@supabase/supabase-js'

type Ctx = {
  user: User
}

export const ctxPlugin: FastifyPluginCallback = fastifyPlugin(
  (fastify, opts, done) => {
    fastify.decorateRequest('ctx', {} as Ctx)

    done()
  },
)

declare module 'fastify' {
  interface FastifyRequest {
    ctx: Ctx
  }
}
