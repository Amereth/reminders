import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from 'fastify'
import { insertLabelsSchema, selectLabelsSchema } from '@reminders/schemas'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { labelsRepository } from './labels.repository'

export const labelsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _options, done) => {
  fastify.get('/labels', {
    schema: {
      response: { 200: z.array(selectLabelsSchema) },
    },

    handler: async (req) => {
      return labelsRepository.findAll({ userId: req.ctx.user.id })
    },
  })

  fastify.get('/labels/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: { 200: selectLabelsSchema },
    },

    handler: (req) => {
      return labelsRepository.findById({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  fastify.post('/labels', {
    schema: {
      body: insertLabelsSchema.pick({ description: true, label: true }),
      response: { 201: z.array(selectLabelsSchema) },
    },

    handler: async (req, res) => {
      res.status(201)

      return labelsRepository.create({
        ...req.body,
        userId: req.ctx.user.id,
      })
    },
  })

  fastify.patch('/labels/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      body: insertLabelsSchema
        .pick({ description: true, dueDate: true })
        .partial(),
      response: { 200: z.array(selectLabelsSchema) },
    },

    handler: (req) => {
      return labelsRepository.update({
        userId: req.ctx.user.id,
        id: req.params.id,
        ...req.body,
      })
    },
  })

  fastify.delete('/labels/:id', {
    schema: {
      params: z.object({ id: z.string() }),
      response: {
        200: z.array(z.object({ id: z.string() })),
      },
    },

    handler: (req) => {
      return labelsRepository.delete({
        userId: req.ctx.user.id,
        id: req.params.id,
      })
    },
  })

  done()
}
