import { InMemoryCheckInsRespository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRespository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { ValidateCheckInUseCase } from "./validate-check-in";

let checkInsRepository: InMemoryCheckInsRespository;
let gymsRepository: InMemoryGymsRespository;
let sut: ValidateCheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRespository();
    gymsRepository = new InMemoryGymsRespository();

    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    const sutPromise = sut.execute({
      checkInId: "inexistent-check-in-id",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

    const sutPromise = sut.execute({
      checkInId: createdCheckIn.id,
    });

    await expect(sutPromise).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
