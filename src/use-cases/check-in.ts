import type { CheckIn } from "generated/prisma";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

type CheckInUseCaseResponse = { checkIn: CheckIn };

export class CheckInUseCase {
  constructor(private checkInsRespository: CheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRespository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRespository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
