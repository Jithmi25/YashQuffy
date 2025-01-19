import { JSDOM } from "jsdom";
import fs from "fs";

import app from "../src/server.js";
import db from "../db/db-config.js";
import testBase from "./testBase.js";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "vitest";
import HttpStatus from "../src/enums/httpStatus.js";

let testSession = null;

/**
 * Create a super test session and initiate the database before running tests.
 */
beforeAll(async () => {
  testSession = testBase.createSuperTestSession(app);
  await testBase.resetDatabase(db);
});

/**
 * Reset the database after every test case
 */
afterEach(async () => {
  await testBase.resetDatabase(db);
});

/**
 * Take down the app once test execution is done
 */
afterAll((done) => {
  app.close(done);
});

describe("Pre authentication tasks", () => {
  test("Challenge 0.a - Change the Homepage title to a given name", async () => {
    const markup = fs.readFileSync("./client/index.html").toString();
    const dom = new JSDOM(markup);
    const document = dom.window.document;
    expect(document.title).toBe("ReelHub");
  });

  test("Challenge 0.b - Set up links for signup, login, and two get started buttons", async () => {
    const markup = fs.readFileSync("./client/index.html").toString();
    const dom = new JSDOM(markup);
    const document = dom.window.document;

    const signUpLink = document.querySelector("#signUpLink");
    expect(signUpLink).not.toBeNull();
    expect(signUpLink.getAttribute("href")).toBe("signup.html");

    const loginLink = document.querySelector("#loginLink");
    expect(loginLink).not.toBeNull();
    expect(loginLink.getAttribute("href")).toBe("login.html");

    const btnGetstarted = document.querySelector(".btnGetstarted");
    expect(btnGetstarted).not.toBeNull();
    expect(btnGetstarted.getAttribute("href")).toBe("login.html");
  });

  test("Challenge 0.c - Two users can't have the same email", async () => {
    const res = await testSession.post("/api/auth/signup").send({
      firstName: "John",
      lastName: "Smith",
      email: "johnS@gmail.com",
      password: "@Test1234",
    });

    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
    expect(res.body.message).toBe("User already exists");
  });
});
