import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { env } from '../utils/env'
import { createClient } from '@supabase/supabase-js'
import createHttpError from 'http-errors'

const callback: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('preHandler', (req, _reply, done) => {
    const Authorization = req.headers.authorization

    if (!Authorization) throw createHttpError(401, 'Unauthorized')

    req.ctx.supabase = createClient(
      env.SUPABASE_PROJECT_URL,
      env.SUPABASE_PUBLIC_KEY,
      // currently not working, possible bug in supabase? used to work
      // {
      //   global: {
      //     headers: { Authorization },
      //   },
      // },
    )

    done()
  })

  done()
}

export const supabasePlugin = fastifyPlugin(callback, {
  name: 'supabase',
  dependencies: ['ctx'],
})
