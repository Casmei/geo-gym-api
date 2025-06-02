import { registerUseCase } from "@/use-cases/register";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(request.body);

  try {
    await registerUseCase({ name, email, password });
  } catch (error) {
    console.log(error);
  }

  return reply.status(201).send();
}
