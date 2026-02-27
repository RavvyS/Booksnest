//  Covers API integration behavior across routes, middleware, and data layer.

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const commentRoutes = require("../../src/interfaces/routes/commentRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const CommentModel = require("../../src/infrastructure/database/schemas/CommentSchema");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

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
    await Promise.all([UserModel.deleteMany({}), CommentModel.deleteMany({})]);
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

describe("Comments API integration", () => {
  test("GET /api/comments returns public list", async () => {
    const res = await request(app).get("/api/comments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/comments returns 401 without token", async () => {
    const res = await request(app).post("/api/comments").send({
      content: "No token comment",
      materialId: "mat-1",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("reader can create/update/delete own comment", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });

    const createRes = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        content: "Initial comment",
        materialId: "mat-101",
      });

    expect(createRes.status).toBe(201);
    const commentId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${readerToken}`)
      .send({ content: "Updated comment" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.content).toBe("Updated comment");

    const deleteRes = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${readerToken}`);

    expect(deleteRes.status).toBe(204);
  });

  test("non-owner author cannot update another user's comment", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const authorToken = await registerAndGetToken({
      name: "Author",
      email: uniqueEmail("author"),
      role: "author",
    });

    const createRes = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        content: "Owned by reader",
        materialId: "mat-101",
      });

    const commentId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ content: "Unauthorized update attempt" });

    expect(updateRes.status).toBe(403);
    expect(updateRes.body.message).toBe("You are not allowed to update this comment");
  });

  test("librarian can delete another user's comment", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const librarianToken = await registerAndGetToken({
      name: "Librarian",
      email: uniqueEmail("librarian"),
      role: "librarian",
    });

    const createRes = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        content: "Reader comment",
        materialId: "mat-101",
      });

    const commentId = createRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(deleteRes.status).toBe(204);
  });
});
