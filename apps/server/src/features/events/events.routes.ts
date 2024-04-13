import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { insertEventsSchema, selectEventsSchema } from '@reminders/schemas'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { eventsRepository, updateSchema } from './events.repository'
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
          data: z.array(selectEventsSchema),
        }),
      },
    },

    handler: async (req) => {
      return eventsRepository.findPaginated({
        userId: req.ctx.user.id,
        ...req.query,
      })
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
      body: insertEventsSchema.pick({
        description: true,
        dueDate: true,
        labels: true,
      }),
      response: { 201: selectEventsSchema },
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
      body: updateSchema,
      response: { 200: selectEventsSchema },
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
        200: z.object({ id: z.string() }),
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
