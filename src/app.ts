import Fastify, { FastifyServerOptions } from "fastify";

export type AppOptions = Partial<FastifyServerOptions>;

export const buildApp = async (options: AppOptions = {}) => {
  const fastify = Fastify(options);

  return fastify;
};
