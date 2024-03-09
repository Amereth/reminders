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
import { and, eq } from "drizzle-orm";

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, options, done) => {
  fastify.get("/events", {
    schema: {
      querystring: z.object({ userId: z.coerce.number() }),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: ({ query }, res) => {
      return db.query.events.findMany({
        where: (event) => eq(event.userId, query.userId),
      });
    },
  });

  fastify.get("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      querystring: z.object({ userId: z.coerce.number() }),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: ({ params, query }, res) => {
      return db.query.events.findMany({
        where: and(eq(events.id, params.id), eq(events.userId, query.userId)),
      });
    },
  });

  fastify.post("/events", {
    schema: {
      body: insertEventsSchema.pick({ description: true, dueDate: true }),
      querystring: z.object({ userId: z.coerce.number() }),
      response: { 201: z.array(selectEventsSchema) },
    },

    handler: async ({ body, query }, res) => {
      const data = await db
        .insert(events)
        .values({
          ...body,
          userId: query.userId,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
        })
        .returning(pick(events, selectEventsSchema.keyof().options));

      res.status(201);
      return data;
    },
  });

  fastify.patch("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      querystring: z.object({ userId: z.coerce.number() }),
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
        .where(and(eq(events.id, params.id), eq(events.userId, query.userId)))
        .returning(pick(events, selectEventsSchema.keyof().options));
    },
  });

  fastify.delete("/events/:id", {
    schema: {
      params: z.object({ id: z.coerce.number() }),
      querystring: z.object({ userId: z.coerce.number() }),
      response: { 200: z.array(selectEventsSchema) },
    },

    handler: ({ params, query }, res) =>
      db
        .delete(events)
        .where(and(eq(events.id, params.id), eq(events.userId, query.userId))),
  });

  done();
};
