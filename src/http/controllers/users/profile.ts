import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeGetUserProfileUseCase();

  const { user } = await useCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ user });
}
