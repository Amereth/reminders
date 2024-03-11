import { routes } from './src/features/index'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import eventsBot from './src/features/events/bot'
import cors from '@fastify/cors'

export const app = Fastify({ logger: true })

app.register(cors, { origin: 'http://localhost:5173' })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.withTypeProvider()

routes.forEach(app.register)

app.setErrorHandler((error, request, reply) => {
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

eventsBot.launch(() => {
  console.log('Bot is running')
})