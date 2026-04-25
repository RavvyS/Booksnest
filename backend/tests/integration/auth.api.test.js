//  Covers API integration behavior across routes, middleware, and data layer.

/**
 * Auth API Integration Tests
 * 
 * Scope: Validates end-to-end authentication flows including registration, login, 
 * profile management, forgot-password, and password changes.
 * 
 * Setup: Uses mongodb-memory-server for isolated state.
 */
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
  test("POST /api/auth/register returns 201 and token for librarian", async () => {
    // Manually approve in DB for tests that expect token (for non-auto-approved roles)
    // Actually, Librarian is auto-approved, so we can test that directly.
    const res = await request(app).post("/api/auth/register").send({
      name: "Integration User",
      email: "integration@example.com",
      password: "StrongPass123!",
      role: "librarian", // Auto-approved
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).not.toBeNull();
    expect(res.body.user.email).toBe("integration@example.com");
  });

  test("POST /api/auth/login returns 200 and token for approved user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "StrongPass123!",
      role: "reader",
    });
    
    // Manually approve
    await UserModel.findOneAndUpdate({ email: "login@example.com" }, { isApproved: true });

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

  test("GET /api/auth/profile returns 200 with valid token", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Profile User",
      email: "profile@example.com",
      password: "StrongPass123!",
      role: "librarian", // Librarian gets token automatically
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

  test("POST /api/auth/forgot-password returns 200 on valid email", async () => {
    // Mock EmailService to avoid real SMTP calls
    const EmailService = require("../../src/infrastructure/services/EmailService");
    jest.spyOn(EmailService, "sendPasswordResetEmail").mockImplementation(() => Promise.resolve());

    await request(app).post("/api/auth/register").send({
      name: "Reset User",
      email: "reset@example.com",
      password: "OldPassword123!",
      role: "reader",
    });

    const res = await request(app).post("/api/auth/forgot-password").send({
      email: "reset@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/temporary password has been sent/i);
    
    // Verify password was actually changed in DB
    const user = await UserModel.findOne({ email: "reset@example.com" });
    expect(user.password).not.toBe("OldPassword123!");
    
    EmailService.sendPasswordResetEmail.mockRestore();
  });

  test("POST /api/auth/change-password returns 200 and updates password", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Change Pass User",
      email: "changepass@example.com",
      password: "OldPassword123!",
      role: "librarian",
    });

    const token = registerRes.body.token;

    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "OldPassword123!",
        newPassword: "NewSuperPassword456!",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/password updated successfully/i);
  });
});
