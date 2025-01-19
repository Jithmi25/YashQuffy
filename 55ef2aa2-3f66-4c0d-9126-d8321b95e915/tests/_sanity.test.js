import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase";
import HttpStatus from "../src/enums/httpStatus.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
var testSession = null;

beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

afterEach(async () => {
  await testBase.resetDatabase(db);
});

afterAll((done) => {
  app.close(done);
});

describe("Authentication tests", () => {
  test("Sanity Test - User login works", async () => {
    const res = await testSession.post("/api/auth/login").send({
      email: "johnS@gmail.com",
      password: "Test@123",
    });
    expect(res.status).toBe(HttpStatus.OK);
    expect(res.body).toHaveProperty("token");
  });

  test("User registration works", async () => {
    const res = await testSession.post("/api/auth/signup").send({
      firstName: "Ryan",
      lastName: "Reynolds",
      email: "ryanR@gmail.com",
      password: "Test@123",
    });
  });

  test("Sanity Test - Database reset for each test", async () => {
    const users = await db.from("user").select("email");
    expect(users.length).toBe(10);
  });
});
