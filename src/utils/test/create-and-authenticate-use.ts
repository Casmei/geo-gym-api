import type { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post("/users").send({
    name: "Tiago de Castro",
    email: "casmei.v4@protonmail.com",
    password: "by@l123",
  });

  const response = await request(app.server).post("/sessions").send({
    email: "casmei.v4@protonmail.com",
    password: "by@l123",
  });

  const { token } = response.body;
  return { token };
}
