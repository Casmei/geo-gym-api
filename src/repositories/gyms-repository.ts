import type { Gym } from "generated/prisma";

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>;
}
