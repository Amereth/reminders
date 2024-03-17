import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { insertEventsSchema, selectEventsSchema } from './events.schema'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { eventsRepository } from './events.repository'

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, options, done) => {
  fastify.get('/events', {
    schema: {
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: async (req) => {
      return eventsRepository.findAll({ userId: req.ctx.user.id })
    },
  })

  fastify.get('/events/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: { 200: selectEventsSchema },
    },

    handler: (req) => {
      return eventsRepository.findById({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  fastify.post('/events', {
    schema: {
      body: insertEventsSchema.pick({ description: true, dueDate: true }),
      response: { 201: z.array(selectEventsSchema) },
    },

    handler: async (req, res) => {
      res.status(201)

      return eventsRepository.create({
        ...req.body,
        userId: req.ctx.user.id,
      })
    },
  })

  fastify.patch('/events/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      body: insertEventsSchema
        .pick({ description: true, dueDate: true })
        .partial(),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: (req) => {
      return eventsRepository.update({
        userId: req.ctx.user.id,
        id: req.params.id,
        ...req.body,
      })
    },
  })

  fastify.delete('/events/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: z.array(z.object({ deletedId: z.string() })),
      },
    },

    handler: (req) => {
      return eventsRepository.delete({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  done()
}
