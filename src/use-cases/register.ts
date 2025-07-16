import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export class RegisterUseCase {
  // biome-ignore lint/suspicious/noExplicitAny: Vai falar disso nas próximas aulas
  constructor(private usersRepository: any) {}
  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userWithSameEamil = await prisma.user.findUnique({
      where: { email },
    });

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
