import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRespository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let usersRepository: InMemoryUsersRespository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRespository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      passoword_hash: await hash("123456", 6),
      created_at: new Date(),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    const sutPromise = sut.execute({
      userId: "non-existing-id",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});
