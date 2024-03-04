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

export const eventsRoutes: FastifyPluginCallback<
  FastifyPluginOptions,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, options, done) => {
  fastify.get("/events", {
    schema: {
      response: { 200: z.array(selectEventsSchema) },
    },
    handler: (req, res) => {
      return db.query.events.findMany();
    },
  });

  fastify.post("/events", {
    schema: {
      body: insertEventsSchema.pick({ description: true, dueDate: true }),
      response: { 201: z.array(selectEventsSchema) },
    },
    handler: (req, res) => {
      const { description, dueDate } = req.body;
      return db
        .insert(events)
        .values({
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          createdAt: new Date(),
        })
        .returning(pick(events, selectEventsSchema.keyof().options));
    },
  });

  done();
};
