//  Covers API integration behavior for Learning Materials including RBAC.

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const materialRoutes = require("../../src/interfaces/routes/materialRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const LearningMaterialModel = require("../../src/infrastructure/database/schemas/LearningMaterialSchema");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

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
    await Promise.all([
      UserModel.deleteMany({}),
      LearningMaterialModel.deleteMany({}),
    ]);
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

describe("Learning Materials API integration", () => {
  test("GET /api/materials returns 200 list", async () => {
    const res = await request(app).get("/api/materials");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/materials success for Author and Librarian", async () => {
    const authorToken = await registerAndGetToken({
      name: "Author User",
      email: uniqueEmail("author"),
      role: "author",
    });

    const librarianToken = await registerAndGetToken({
      name: "Librarian User",
      email: uniqueEmail("librarian"),
      role: "librarian",
    });

    // Author creation
    const resAuthor = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Introduction to Node.js",
        description: "Basics of Node",
        contentUrl: "http://example.com/node.pdf",
        category: "Programming",
        author: "Alice",
      });

    expect(resAuthor.status).toBe(201);
    expect(resAuthor.body.status).toBe("pending");

    // Librarian creation
    const resLib = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({
        title: "Librarian Upload",
        description: "Manual upload",
        contentUrl: "http://example.com/manual.pdf",
        category: "Manuals",
        author: "Bob",
      });

    expect(resLib.status).toBe(201);
  });

  test("POST /api/materials forbidden for Reader", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader User",
      email: uniqueEmail("reader"),
      role: "reader",
    });

    const res = await request(app)
      .post("/api/materials")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        title: "Reader Material",
        contentUrl: "http://example.com/reader.pdf",
        author: "Charlie",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden: insufficient role");
  });

  test("Librarian can approve materials", async () => {
    const librarianToken = await registerAndGetToken({
      name: "Librarian User",
      email: uniqueEmail("librarian"),
      role: "librarian",
    });

    // Create a pending material directly via DB to test approval
    const material = await LearningMaterialModel.create({
      title: "Review Me",
      contentUrl: "http://test.com/review",
      author: "Alice",
      status: "pending",
      uploadedBy: new mongoose.Types.ObjectId()
    });

    const approveRes = await request(app)
      .patch(`/api/materials/${material._id}/approve`)
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({ status: "approved" });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe("approved");
  });

  test("Author cannot approve materials", async () => {
    const authorToken = await registerAndGetToken({
      name: "Author User",
      email: uniqueEmail("author"),
      role: "author",
    });

    const material = await LearningMaterialModel.create({
      title: "Wait for it",
      contentUrl: "http://test.com/wait",
      author: "Alice",
      status: "pending",
      uploadedBy: new mongoose.Types.ObjectId()
    });

    const approveRes = await request(app)
      .patch(`/api/materials/${material._id}/approve`)
      .set("Authorization", `Bearer ${authorToken}`)
      .send({ status: "approved" });

    expect(approveRes.status).toBe(403);
  });

  test("Librarian can view pending queue", async () => {
    const librarianToken = await registerAndGetToken({
      name: "Librarian User",
      email: uniqueEmail("librarian"),
      role: "librarian",
    });

    await LearningMaterialModel.create({
      title: "Pending Item",
      contentUrl: "http://test.com/pending",
      author: "Alice",
      status: "pending",
      uploadedBy: new mongoose.Types.ObjectId()
    });

    const res = await request(app)
      .get("/api/materials/pending")
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].status).toBe("pending");
  });
});
