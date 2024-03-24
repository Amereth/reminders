import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { SupabaseClient, User } from '@supabase/supabase-js'

export type Ctx = {
  user: User
  supabase: SupabaseClient
}

const callback: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.decorateRequest('ctx', {} as Ctx)

  done()
}

export const ctxPlugin = fastifyPlugin(callback, {
  name: 'ctx',
})

declare module 'fastify' {
  interface FastifyRequest {
    ctx: Ctx
  }
}
