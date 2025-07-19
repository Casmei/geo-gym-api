import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/check-ins/history", history);
  app.post("/check-ins/metrics", metrics);
  app.post("/gyms/:gymId/check-ins", create);
  app.post("/check-ins/:checkInId/validate", validate);
}
