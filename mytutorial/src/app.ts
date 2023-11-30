import fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt from "@fastify/jwt";
import userRoutes from "./modules/user/user.route";
import { userScemas } from "./modules/user/user.schemas";
import { productSchemas } from "./modules/product/product.schemas";

export const server = fastify();

// could be in a tupes file

server.register(fjwt, {
  secret: "supersecret",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      console.log(error);
      reply.status(401).send({ message: "Unauthorized" });
    }
  }
);

server.get("/healthcheck", async function () {
  return { status: "ok" };
});

async function main() {
  for (const schema of [userScemas, productSchemas]) {
    server.addSchema(schema);
  }
  server.register(userRoutes, { prefix: "api/users" });
  try {
    await server.listen(3000, "0.0.0.0");
    console.log("Server running on port 3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
main();
