import { FastifyRequest } from 'fastify'

export const getToken = (req: FastifyRequest): string =>
  req.headers.authorization?.split(' ')[1] ?? ''
