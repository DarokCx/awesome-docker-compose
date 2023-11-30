import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { createUserInput, LoginInput } from "./user.schemas";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: { email: string; name: string; password: string };
  }>,
  reply: FastifyReply
) {
  const body = request.body as {
    email: string;
    name: string;
    password: string;
  };

  try {
    const user = await createUser(body);
    return reply.status(201).send(user);
  } catch (error) {
    console.log(error);
    reply.status(500).send({ message: "Something went wrong" });
  }
}
// had to specify the type of the request body
export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find a user with the email
  const user = await findUserByEmail(body.email);
  if (!user) {
    return reply.status(401).send({ message: "invalid credentials" });
  }

  // verify the password
  const correctPassword = verifyPassword(
    body.password,
    user.password,
    user.salt
  );
  if (correctPassword) {
    // generate token
    const { password, salt, ...rest } = user;
    // send back the token
    return { accessToken: server.jwt.sign(rest) };
  }
  return reply.status(401).send({ message: "invalid credentials" });
}

export async function getusersHandler(request: FastifyRequest, reply: FastifyReply){
    const users = await findUsers()

    return users;
}
