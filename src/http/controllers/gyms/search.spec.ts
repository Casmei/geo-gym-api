import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-use";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Serach Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Golang Gym",
        description: "Some description",
        phone: "33999166432",
        latitude: -16.175336,
        longitude: -40.69287,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Scala Gym",
        description: "Some description",
        phone: "33999166432",
        latitude: -16.4371206,
        longitude: -41.0095796,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "Golang",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Golang Gym",
      }),
    ]);
  });
});
