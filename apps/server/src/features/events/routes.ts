import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { events, insertEventsSchema, selectEventsSchema } from './schema'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { db } from '../../lib/db'
import { pick } from 'remeda'
import { and, eq } from 'drizzle-orm'
import crypto from 'crypto'

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, options, done) => {
  fastify.get('/events', {
    schema: {
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: async (req, res) => {
      const user = req.ctx.user

      return db.query.events.findMany()
    },
  })

  fastify.get('/events/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: ({ params, query }, res) => {
      return db.query.events.findMany({
        where: and(
          eq(events.id, params.id),
          // eq(events.userId, query.userId)
        ),
      })
    },
  })

  fastify.post('/events', {
    schema: {
      body: insertEventsSchema.pick({ description: true, dueDate: true }),
      response: { 201: z.array(selectEventsSchema) },
    },

    handler: async (req, res) => {
      const d = await db
        .insert(events)
        .values({
          ...req.body,
          id: crypto.randomUUID(),
          userId: req.ctx.user.id,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        })
        .returning(pick(events, selectEventsSchema.keyof().options))

      res.status(201)
      return d
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

    handler: ({ body, params, query }, res) => {
      return db
        .update(events)
        .set({
          ...body,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        })
        .where(
          and(
            eq(events.id, params.id),
            // eq(events.userId, query.userId)
          ),
        )
        .returning(pick(events, selectEventsSchema.keyof().options))
    },
  })

  fastify.delete('/events/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: ({ params, query }, res) =>
      db.delete(events).where(
        and(
          eq(events.id, params.id),
          // eq(events.userId, query.userId)
        ),
      ),
  })

  done()
}
