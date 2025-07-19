import { makeSearchGymsInUseCase } from "@/use-cases/factories/make-search-gym-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchGymsQuerySchema.parse(request.query);

  const useCase = makeSearchGymsInUseCase();
  const { gyms } = await useCase.execute({
    query: q,
    page,
  });

  return reply.status(201).send({ gyms });
}
