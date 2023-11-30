import prisma from "../../utils/prisma";
import { createProductInput } from "./product.schemas";

export async function createProduct(
  data: createProductInput & { ownerId: number }
) {
  return await prisma.product.create({
    data,
  });
}

export function getProducts() {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}
