import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const user = await prisma.user.create({
    data: {
      name: "Tiago de Castro",
      email: "casmei.v4@protonmail.com",
      password_hash: await hash("by@l123", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  const response = await request(app.server).post("/sessions").send({
    email: "casmei.v4@protonmail.com",
    password: "by@l123",
  });

  const { token } = response.body;

  return { token };
}
