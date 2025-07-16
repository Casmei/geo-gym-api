import { prisma } from "@/lib/prisma";
import type { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userWithSameEamil = await this.usersRepository.findByEmail(email);

    if (userWithSameEamil) {
      throw new Error("Email already exists");
    }

    const passoword_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      passoword_hash,
    });
  }
}

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}
