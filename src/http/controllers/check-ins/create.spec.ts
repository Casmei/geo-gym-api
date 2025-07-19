import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-use";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create CheckIns (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    //TODO: entender um pattern melhor
    const gym = await prisma.gym.create({
      data: {
        title: "Go Gym",
        description: "Some description",
        phone: "33999166432",
        latitude: -16.175336,
        longitude: -40.69287,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -16.175336,
        longitude: -40.69287,
      });

    expect(response.statusCode).toEqual(201);
  });
});
