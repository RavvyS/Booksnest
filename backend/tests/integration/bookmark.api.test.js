/**
 * Integration tests for the Bookmark API.
 * Covers CRUD operations for user bookmarks.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const bookmarkRoutes = require("../../src/interfaces/routes/bookmarkRoutes");
const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const BookmarkModel = require("../../src/infrastructure/database/schemas/BookmarkSchema");
const UserModel = require("../../src/infrastructure/database/UserModel");
const TokenService = require("../../src/infrastructure/services/TokenService");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

let mongoServer;
let readerToken;
let readerId;

jest.setTimeout(30000);

const uniqueEmail = (prefix) => `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const setupUser = async ({ name, email, role }) => {
  const user = new UserModel({
    name,
    email,
    password: "Password123!",
    role,
    isApproved: true
  });
  await user.save();
  return { token: TokenService.generate(user), id: user._id.toString() };
};

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  mongoServer = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
  await mongoose.connect(mongoServer.getUri());

  const reader = await setupUser({ name: "Reader", email: uniqueEmail("reader"), role: "reader" });
  readerToken = reader.token;
  readerId = reader.id;
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await BookmarkModel.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) await mongoServer.stop();
});

describe("Bookmark API CRUD", () => {
  
  test("Reader can create a bookmark", async () => {
    const res = await request(app)
      .post("/api/bookmarks")
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        materialId: new mongoose.Types.ObjectId().toString(),
        materialTitle: "Some Material",
        materialContentUrl: "http://example.com/content",
        note: "My first bookmark"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("materialTitle", "Some Material");
    expect(res.body).toHaveProperty("note", "My first bookmark");
  });

  test("Reader can get their bookmarks", async () => {
    // Pre-create a bookmark
    const bookmark = new BookmarkModel({
      userId: readerId,
      materialId: new mongoose.Types.ObjectId(),
      materialTitle: "Bookmark 1",
      materialContentUrl: "http://example.com/1",
      note: "Note 1"
    });
    await bookmark.save();

    const res = await request(app)
      .get("/api/bookmarks")
      .set("Authorization", `Bearer ${readerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].materialTitle).toBe("Bookmark 1");
  });

  test("Reader can update their bookmark", async () => {
    const bookmark = new BookmarkModel({
      userId: readerId,
      materialId: new mongoose.Types.ObjectId(),
      materialTitle: "Update Me",
      materialContentUrl: "http://example.com/update",
      note: "Old note"
    });
    await bookmark.save();

    const res = await request(app)
      .put(`/api/bookmarks/${bookmark._id}`)
      .set("Authorization", `Bearer ${readerToken}`)
      .send({
        note: "New and improved note",
        isFavorite: true
      });

    expect(res.status).toBe(200);
    expect(res.body.note).toBe("New and improved note");
    expect(res.body.isFavorite).toBe(true);
  });

  test("Reader can delete their bookmark", async () => {
    const bookmark = new BookmarkModel({
      userId: readerId,
      materialId: new mongoose.Types.ObjectId(),
      materialTitle: "Delete Me",
      materialContentUrl: "http://example.com/delete",
      note: "To be deleted"
    });
    await bookmark.save();

    const res = await request(app)
      .delete(`/api/bookmarks/${bookmark._id}`)
      .set("Authorization", `Bearer ${readerToken}`);

    expect(res.status).toBe(204);
    
    const found = await BookmarkModel.findById(bookmark._id);
    expect(found).toBeNull();
  });

  test("Non-owner cannot delete someone else's bookmark", async () => {
      // Create another user
      const otherReader = await setupUser({ name: "Other", email: uniqueEmail("other"), role: "reader" });
      
      const bookmark = new BookmarkModel({
        userId: readerId, // Owned by first reader
        materialId: new mongoose.Types.ObjectId(),
        materialTitle: "Private Bookmark",
        materialContentUrl: "http://example.com/private",
        note: "Private"
      });
      await bookmark.save();

      const res = await request(app)
        .delete(`/api/bookmarks/${bookmark._id}`)
        .set("Authorization", `Bearer ${otherReader.token}`);

      // Assuming the controller/usecase protects this
      expect(res.status).toBe(400); // Or 403 or 404 depending on implementation
  });
});
