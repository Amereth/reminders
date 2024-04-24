import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { insertEventSchema, eventSchema } from '@reminders/schemas'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { eventsRepo, updateSchema } from './events.repository'
import { paginatedArgsSchema, paginatedResponseSchema } from '@/lib/repository'

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _options, done) => {
  fastify.get('/events/paginated', {
    schema: {
      querystring: paginatedArgsSchema,
      response: {
        200: paginatedResponseSchema.extend({
          data: z.array(eventSchema),
        }),
      },
    },

    handler: (req) => {
      return eventsRepo.findPaginated({
        userId: req.ctx.user.id,
        ...req.query,
      })
    },
  })

  fastify.get('/events/:id', {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      response: { 200: eventSchema },
    },

    handler: (req) => {
      return eventsRepo.findById({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  fastify.post('/events', {
    schema: {
      body: insertEventSchema.pick({
        description: true,
        dueDate: true,
        labels: true,
      }),
      response: { 201: eventSchema },
    },

    handler: (req, res) => {
      res.status(201)

      return eventsRepo.create({
        ...req.body,
        userId: req.ctx.user.id,
      })
    },
  })

  fastify.patch('/events/:id', {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      body: updateSchema,
      response: { 200: eventSchema },
    },

    handler: (req) => {
      return eventsRepo.update({
        userId: req.ctx.user.id,
        id: req.params.id,
        ...req.body,
      })
    },
  })

  fastify.delete('/events/:id', {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      response: {
        200: z.object({ id: z.string() }),
      },
    },

    handler: (req) => {
      return eventsRepo.delete({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  done()
}
