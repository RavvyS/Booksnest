//  Covers API integration behavior across routes, middleware, and data layer.

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const borrowRoutes = require("../../src/interfaces/routes/borrowRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const QueueModel = require("../../src/infrastructure/database/schemas/QueueRequestSchema");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/borrows", borrowRoutes);

let mongoServer;
jest.setTimeout(30000);

const uniqueEmail = (prefix) => `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const registerAndGetToken = async ({ name, email, role }) => {
  const registerRes = await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "StrongPass123!",
    role,
  });

  return registerRes.body.token;
};

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
  mongoServer = await MongoMemoryServer.create({
    instance: { ip: "127.0.0.1" },
  });
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Promise.all([UserModel.deleteMany({}), QueueModel.deleteMany({})]);
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

describe("Queue API role-based integration", () => {
  test("GET /api/borrows/queue/my returns 401 without token", async () => {
    const res = await request(app).get("/api/borrows/queue/my");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("GET /api/borrows/queue/my returns 403 for non-reader role", async () => {
    const authorToken = await registerAndGetToken({
      name: "Author",
      email: uniqueEmail("author"),
      role: "author",
    });

    const res = await request(app)
      .get("/api/borrows/queue/my")
      .set("Authorization", `Bearer ${authorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden: insufficient role");
  });

  test("GET /api/borrows/queue/my returns 200 for reader role", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });

    const res = await request(app)
      .get("/api/borrows/queue/my")
      .set("Authorization", `Bearer ${readerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
