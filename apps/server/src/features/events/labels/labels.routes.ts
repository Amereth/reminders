import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { insertLabelSchema, labelSchema } from '@reminders/schemas'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { labelsRepo } from './labels.repository'

export const labelsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _options, done) => {
  fastify.get('/labels', {
    schema: {
      response: { 200: z.array(labelSchema) },
    },

    handler: (req) => {
      return labelsRepo.findAll({ userId: req.ctx.user.id })
    },
  })

  fastify.get('/labels/user', {
    schema: {
      response: { 200: z.array(labelSchema) },
    },

    handler: (req) => {
      return labelsRepo.findUsersLabels({ userId: req.ctx.user.id })
    },
  })

  fastify.post('/labels', {
    schema: {
      body: insertLabelSchema.pick({
        description: true,
        label: true,
      }),
      response: { 201: labelSchema },
    },

    handler: (req, res) => {
      res.status(201)

      return labelsRepo.create({
        ...req.body,
        userId: req.ctx.user.id,
      })
    },
  })

  fastify.patch('/labels/:id', {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      body: insertLabelSchema
        .pick({ description: true, dueDate: true })
        .partial(),
      response: { 200: labelSchema },
    },

    handler: (req) => {
      return labelsRepo.update({
        userId: req.ctx.user.id,
        id: req.params.id,
        ...req.body,
      })
    },
  })

  fastify.delete('/labels/:id', {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      response: {
        200: z.object({ id: z.coerce.string() }),
      },
    },

    handler: (req) => {
      return labelsRepo.delete({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  done()
}
