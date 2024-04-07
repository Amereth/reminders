import { routes } from './src/features/index'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { plugins } from './src/plugins/index'

export const app = Fastify({ logger: true })

app.register(cors, { origin: 'http://localhost:5173' })
app.register(cookie, { hook: 'onRequest' })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.withTypeProvider()

plugins.forEach(app.register)
routes.forEach(([plugin, options]) => app.register(plugin, options))

app.setErrorHandler((error, request, reply) => {
  console.error('ERROR', error)
  reply.status(error.statusCode ?? 500)
  return error
})

app.listen({ port: 8080, host: 'localhost' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})

// eventsBot.launch(() => {
//   console.log('Bot is running')
// })
