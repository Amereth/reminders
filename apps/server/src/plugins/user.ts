import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import createHttpError from 'http-errors'

const callback: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.addHook('preHandler', async (req, reply) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) throw createHttpError(401, 'Unauthorized')

    const { data, error } = await fastify.supabase.auth.getUser(token)

    if (error) {
      reply.status(error.status ?? 401).send(error.message)
      return
    }

    req.ctx.user = data.user
  })
  done()
}

export const userPlugin = fastifyPlugin(callback, {
  name: 'user',
  dependencies: ['supabase'],
})
