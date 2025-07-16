import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRespository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { Decimal } from "@prisma/client/runtime/library";

let gymsRepository: InMemoryGymsRespository;
let sut: CreateGymUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRespository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to regiter", async () => {
    const { gym } = await sut.execute({
      title: "Go Gym",
      description: null,
      phone: null,
      latitude: -16.1803162,
      longitude: -40.68543,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
