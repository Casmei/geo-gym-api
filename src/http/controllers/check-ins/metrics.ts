import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await useCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
