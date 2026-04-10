const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const categoryRoutes = require("../../src/interfaces/routes/categoryRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const CategoryModel = require("../../src/infrastructure/database/schemas/CategorySchema");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

let mongoServer;
jest.setTimeout(30000);

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const registerAndGetToken = async ({ name, email, role }) => {
  const res = await request(app).post("/api/auth/register").send({
    name,
    email,
    password: "StrongPass123!",
    role,
  });

  return res.body.token;
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
    await Promise.all([UserModel.deleteMany({}), CategoryModel.deleteMany({})]);
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

describe("Category API integration", () => {
  test("GET /api/categories returns empty array initially", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("POST /api/categories requires authentication", async () => {
    const res = await request(app).post("/api/categories").send({
      name: "Fiction",
      description: "Fiction books",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("POST /api/categories forbids non-librarian roles", async () => {
    const readerToken = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });

    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        name: "Fiction",
        description: "Fiction books",
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Forbidden: insufficient role");
  });

  test("librarian can create, read, update, and delete a category", async () => {
    const librarianToken = await registerAndGetToken({
      name: "Librarian",
      email: uniqueEmail("librarian"),
      role: "librarian",
    });

    const createRes = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({
        name: "Science",
        description: "Science books",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe("Science");
    const categoryId = createRes.body.id || createRes.body._id;

    const listRes = await request(app).get("/api/categories");
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(1);

    const getRes = await request(app).get(`/api/categories/${categoryId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.name).toBe("Science");

    const updateRes = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({
        name: "Updated Science",
        description: "Updated description",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe("Updated Science");

    const deleteRes = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Category deleted successfully");
  });
}
);

