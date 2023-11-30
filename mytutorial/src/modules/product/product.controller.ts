import { FastifyReply } from "fastify";
import { createProductInput } from "./product.schemas";
import { createProduct } from "./product.service";

export async function createProductHandler<T extends { body: any; user: any }>(
  request: T,
  reply: FastifyReply
) {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return product;
}
