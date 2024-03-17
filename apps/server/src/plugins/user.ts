import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import createHttpError from 'http-errors'

const callback: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.addHook('preHandler', async (req) => {
    const { data, error } = await req.ctx.supabase.auth.getUser()

    if (error) throw createHttpError(error.status ?? 401, error.message)

    req.ctx.user = data.user
  })
  done()
}

export const userPlugin = fastifyPlugin(callback, {
  name: 'user',
  dependencies: ['supabase'],
})
