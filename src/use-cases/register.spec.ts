import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRespository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to regiter", async () => {
    const usersRespository = new InMemoryUsersRespository();
    const sut = new RegisterUseCase(usersRespository);

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRespository = new InMemoryUsersRespository();
    const sut = new RegisterUseCase(usersRespository);

    const password = "123456";

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password,
    });

    const isPasswordCorrectlyHashed = await compare(
      password,
      user.passoword_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRespository = new InMemoryUsersRespository();
    const sut = new RegisterUseCase(usersRespository);

    const email = "johndoe@example.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    const sutPromise = sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() => sutPromise).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
  });
});
