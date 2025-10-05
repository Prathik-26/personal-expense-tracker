const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
require("dotenv").config();

let token;
let expenseId;

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri);
  await mongoose.connection.db.dropDatabase(); // clean test DB

  // Create a new user for this test suite
  const timestamp = Date.now();
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Expense Tester",
      email: `expense_${timestamp}@example.com`,
      password: "123456",
    });

  // Login and store token
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: `expense_${timestamp}@example.com`,
      password: "123456",
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // clean again after tests
  await mongoose.connection.close();
});

describe("Expense Endpoints", () => {
  it("should create a new expense", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Lunch",
        amount: 150,
        category: "Food",
        date: new Date(),
        notes: "Lunch with friends",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Lunch");
    expenseId = res.body._id;
  });

  it("should get all expenses", async () => {
    const res = await request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.expenses)).toBe(true);
  });

  it("should update an expense", async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(200);
  });

  it("should delete the expense", async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});

describe("Summary Endpoint", () => {
  it("should return an empty array or summary data", async () => {
    const res = await request(app)
      .get("/api/expenses/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
