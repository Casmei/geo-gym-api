import type { Prisma, User } from "generated/prisma";
import type { UsersRepository } from "../users-repository";

export class InMemoryUsersRespository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      passoword_hash: data.passoword_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
