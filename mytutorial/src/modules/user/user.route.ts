import { FastifyInstance } from "fastify";
import {
  getusersHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schemas";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.get(
    "/",
    {
      preHandler: [server],
    },
    getusersHandler
  );
}
export default userRoutes;
