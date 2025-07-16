import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRespository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials.error";

let usersRepository: InMemoryUsersRespository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRespository();
    sut = new AuthenticateUseCase(usersRepository);
  });
  it("should be able to authenticate", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    await usersRepository.create({
      name: "John Doe",
      email,
      passoword_hash: await hash(password, 6),
      created_at: new Date(),
    });

    const { user } = await sut.execute({
      email,
      password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const sutPromise = sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      passoword_hash: await hash("1234567", 6),
      created_at: new Date(),
    });

    const sutPromise = sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
