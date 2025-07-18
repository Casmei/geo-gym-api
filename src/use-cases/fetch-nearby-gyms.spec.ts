import { InMemoryGymsRespository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRespository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRespository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    // Arrange
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -16.175336,
      longitude: -40.69287,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -16.4371206,
      longitude: -41.0095796,
    });

    //Act
    const { gyms } = await sut.execute({
      userLatitude: -16.1867046,
      userLongitude: -40.6873863,
    });

    //Assert
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
