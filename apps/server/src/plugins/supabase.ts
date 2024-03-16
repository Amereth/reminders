import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { env } from '../utils/env'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient
  }
}

const callback: FastifyPluginCallback = (fastify, opts, done) => {
  const supabase = createClient(
    env.SUPABASE_PROJECT_URL,
    env.SUPABASE_PUBLIC_KEY,
  )

  fastify.decorate('supabase', supabase)

  done()
}

export const supabasePlugin = fastifyPlugin(callback, {
  name: 'supabase',
  dependencies: ['ctx'],
})
