import Fastify from "fastify";
import "dotenv/config";

const fastify = Fastify({
  logger: true,
});

fastify.listen({ port: 3000, host: "localhost" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
