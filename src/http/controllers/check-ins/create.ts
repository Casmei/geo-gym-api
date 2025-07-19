import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const createParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { latitude, longitude } = createBodySchema.parse(request.body);
  const { gymId } = createParamsSchema.parse(request.params);

  const useCase = makeCheckInUseCase();
  await useCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
