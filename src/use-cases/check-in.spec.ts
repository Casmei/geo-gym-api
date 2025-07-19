import { InMemoryCheckInsRespository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRespository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckInsRespository;
let gymsRepository: InMemoryGymsRespository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRespository();
    gymsRepository = new InMemoryGymsRespository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Go Gym",
      description: null,
      phone: null,
      latitude: -16.1803162,
      longitude: -40.68543,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    const sutPromise = sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      MaxNumberOfCheckInsError,
    );
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "Go Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-16.1577679),
      longitude: new Decimal(-40.6926947),
    });

    const sutPromise = sut.execute({
      gymId: "gym-02",
      userId: "user-01",
      userLatitude: -16.1803162,
      userLongitude: -40.68543,
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
