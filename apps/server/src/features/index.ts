import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  RawServerDefault,
} from 'fastify'
import { eventsRoutes } from './events/events.routes'
import { labelsRoutes } from './events/labels/labels.routes'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export const routes: [
  FastifyPluginCallback<
    FastifyPluginOptions,
    RawServerDefault,
    ZodTypeProvider
  >,
  FastifyRegisterOptions<FastifyPluginOptions>,
][] = [
  [eventsRoutes, {}],
  [labelsRoutes, { prefix: '/events' }],
]
