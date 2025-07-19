import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "generated/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUseCaseRequest {
  userId: string;
}

type GetUserProfileUseCaseResponse = { user: Omit<User, "password_hash"> };

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }
    const { password_hash, ...publicUser } = user;

    return { user: publicUser };
  }
}
