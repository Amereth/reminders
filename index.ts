import { routes } from "./src/features/index";
import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import eventsBot from "./src/features/events/bot";

export const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider();

routes.forEach(app.register);

app.listen({ port: 3000, host: "localhost" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`server listening on ${address}`);
});

eventsBot.launch(() => {
  console.log("Bot is running");
});
