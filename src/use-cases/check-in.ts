import type { CheckIn } from "generated/prisma";
import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

type CheckInUseCaseResponse = { checkIn: CheckIn };

export class CheckInUseCase {
  constructor(
    private checkInsRespository: CheckInsRepository,
    private gymsRespository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRespository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    //todo: calculate distance between uaser and gym

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
