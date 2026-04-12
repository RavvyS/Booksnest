/**
 * Integration tests for the User API (Librarian management).
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const userRoutes = require("../../src/interfaces/routes/userRoutes");
const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const TokenService = require("../../src/infrastructure/services/TokenService");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

let mongoServer;
let librarianToken;

jest.setTimeout(30000);

const uniqueEmail = (prefix) => `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const setupUser = async ({ name, email, role, isApproved = true }) => {
  const user = new UserModel({
    name,
    email,
    password: "Password123!",
    role,
    isApproved
  });
  await user.save();
  return { token: TokenService.generate(user), id: user._id.toString() };
};

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  mongoServer = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
  await mongoose.connect(mongoServer.getUri());

  const librarian = await setupUser({ name: "Librarian", email: uniqueEmail("librarian"), role: "librarian" });
  librarianToken = librarian.token;
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    // Keep the librarian but delete others if needed, 
    // or just delete everything and recreate librarian in beforeAll (wait, beforeAll only runs once).
    // Let's delete all and recreate librarian in setup if necessary, 
    // but for simplicity, I'll just delete those not named "Librarian".
    await UserModel.deleteMany({ role: { $ne: "librarian" } });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) await mongoServer.stop();
});

describe("User Management API (Librarian)", () => {
  
  test("Librarian can get pending users", async () => {
    // Create a pending reader
    await setupUser({ name: "Pending User", email: uniqueEmail("pending"), role: "reader", isApproved: false });

    const res = await request(app)
      .get("/api/users/pending")
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(u => u.name === "Pending User")).toBe(true);
  });

  test("Librarian can approve a user", async () => {
    const pending = await setupUser({ name: "To Approve", email: uniqueEmail("approve"), role: "author", isApproved: false });

    const res = await request(app)
      .post(`/api/users/approve/${pending.id}`)
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User approved successfully");
    
    const updatedUser = await UserModel.findById(pending.id);
    expect(updatedUser.isApproved).toBe(true);
  });

  test("Librarian can delete a user", async () => {
    const user = await setupUser({ name: "To Delete", email: uniqueEmail("delete"), role: "reader" });

    const res = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
    
    const found = await UserModel.findById(user.id);
    expect(found).toBeNull();
  });

  test("Reader cannot access pending users", async () => {
    const reader = await setupUser({ name: "Reader", email: uniqueEmail("reader"), role: "reader" });

    const res = await request(app)
      .get("/api/users/pending")
      .set("Authorization", `Bearer ${reader.token}`);

    expect(res.status).toBe(403);
  });
});
