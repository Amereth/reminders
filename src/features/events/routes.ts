import {
  FastifyPluginCallback,
  FastifyPluginOptions,
  RawServerDefault,
} from "fastify";
import { events, insertEventsSchema, selectEventsSchema } from "./schema";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../lib/db";
import { pick } from "remeda";
import { eq } from "drizzle-orm";

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, options, done) => {
  fastify.get("/events", {
    schema: {
      response: { 200: z.array(selectEventsSchema) },
    },
    handler: (req, res) => db.query.events.findMany(),
  });

  fastify.get("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      response: { 200: z.array(selectEventsSchema) },
    },
    handler: ({ params }, res) =>
      db.query.events.findMany({
        where: (event) => eq(event.id, params.id),
      }),
  });

  fastify.post("/events", {
    schema: {
      body: insertEventsSchema.pick({ description: true, dueDate: true }),
      response: { 201: z.array(selectEventsSchema) },
    },
    handler: ({ body }, res) =>
      db
        .insert(events)
        .values({
          ...body,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        })
        .returning(pick(events, selectEventsSchema.keyof().options)),
  });

  fastify.patch("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      body: insertEventsSchema
        .pick({ description: true, dueDate: true })
        .partial(),
      response: { 201: z.array(selectEventsSchema) },
    },
    handler: async ({ body, params }, res) => {
      const response = await db
        .update(events)
        .set({
          ...body,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        })
        .where(eq(events.id, params.id))
        .returning(pick(events, selectEventsSchema.keyof().options));

      res.status(201);
      return response;
    },
    errorHandler(error, request, reply) {
      reply.status(500);
      return error;
    },
  });

  fastify.delete("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      response: { 200: z.array(selectEventsSchema) },
    },
    handler: ({ params }, res) =>
      db.delete(events).where(eq(events.id, params.id)),
  });

  done();
};
