import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export async function registerUseCase({
	email,
	name,
	password,
}: RegisterUseCaseRequest) {
	const userWithSameEamil = await prisma.user.findUnique({ where: { email } });

	if (userWithSameEamil) {
		throw new Error("Email already exists.");
	}

	const passoword_hash = await hash(password, 6);

	await prisma.user.create({
		data: {
			name,
			email,
			passoword_hash,
		},
	});
}
