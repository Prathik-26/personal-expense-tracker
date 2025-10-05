const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
require("dotenv").config();

let token;
let emailForLogin;
beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const timestamp = Date.now();
    emailForLogin = `testuser_${timestamp}@example.com`;

    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: emailForLogin,
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(emailForLogin);
  });

  it("should login successfully and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: emailForLogin,
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});

module.exports = { token };
