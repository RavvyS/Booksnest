const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

let mongoServer;
jest.setTimeout(30000);

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
  mongoServer = await MongoMemoryServer.create({
    instance: { ip: "127.0.0.1" },
  });
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await UserModel.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Auth API integration", () => {
  test("POST /api/auth/register creates user and returns token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Integration User",
      email: "integration@example.com",
      password: "StrongPass123!",
      role: "reader",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("integration@example.com");
  });

  test("POST /api/auth/login authenticates existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "StrongPass123!",
      role: "reader",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "StrongPass123!",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("login@example.com");
  });

  test("GET /api/auth/profile returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/profile");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("GET /api/auth/profile returns profile with valid token", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Profile User",
      email: "profile@example.com",
      password: "StrongPass123!",
      role: "reader",
    });

    const token = registerRes.body.token;

    const profileRes = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(profileRes.status).toBe(200);
    expect(profileRes.body.email).toBe("profile@example.com");
    expect(profileRes.body).not.toHaveProperty("password");
  });

  test("POST /api/auth/login returns 400 on wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Wrong Password User",
      email: "wrongpass@example.com",
      password: "CorrectPass123!",
      role: "reader",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "IncorrectPass123!",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});
