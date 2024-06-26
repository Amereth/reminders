import { getToken } from '@/utils/getToken'
import { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import createHttpError from 'http-errors'

const callback: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('preHandler', async (req) => {
    const { data, error } = await req.ctx.supabase.auth.getUser(getToken(req))

    if (error) throw createHttpError(error.status ?? 500, error.message)

    req.ctx.user = data.user
  })
  done()
}

export const userPlugin = fastifyPlugin(callback, {
  name: 'user',
  dependencies: ['supabase'],
})
