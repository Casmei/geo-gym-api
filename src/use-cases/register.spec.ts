import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null;
      },
      async create(data) {
        return {
          id: "user-1",
          name: data.name,
          email: data.email,
          passoword_hash: data.passoword_hash,
          created_at: new Date(),
        };
      },
    });

    const password = "123456";

    const { user } = await registerUseCase.execute({
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
});
