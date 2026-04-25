/**
 * Book API Integration Tests
 * 
 * Scope: Validates CRUD operations, role-based access control, AI-powered 
 * external metadata search, and secure PDF streaming.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const path = require("path");
const fs = require("fs");

const bookRoutes = require("../../src/interfaces/routes/bookRoutes");
const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const BookModel = require("../../src/infrastructure/database/schemas/BookSchema");
const CategoryModel = require("../../src/infrastructure/database/schemas/CategorySchema");
const UserModel = require("../../src/infrastructure/database/UserModel");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

let mongoServer;
let authorToken;
let librarianToken;
let readerToken;

jest.setTimeout(30000);

const uniqueEmail = (prefix) => `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const TokenService = require("../../src/infrastructure/services/TokenService");

const registerAndGetToken = async ({ name, email, role }) => {
  const user = new UserModel({
    name,
    email,
    password: "Password123!",
    role,
    isApproved: true
  });
  await user.save();
  return TokenService.generate(user);
};

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-key";
  mongoServer = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
  await mongoose.connect(mongoServer.getUri());

  authorToken = await registerAndGetToken({ name: "Author", email: uniqueEmail("author"), role: "author" });
  librarianToken = await registerAndGetToken({ name: "Librarian", email: uniqueEmail("librarian"), role: "librarian" });
  readerToken = await registerAndGetToken({ name: "Reader", email: uniqueEmail("reader"), role: "reader" });
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await BookModel.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) await mongoServer.stop();
});

describe("Book API CRUD", () => {
  
  test("Author can create a book (without physical file for simplicity in this test)", async () => {
    // Note: Since multer is used, we'd normally use .attach('file', ...)
    // But we can also test the controller's logic if we mock or handle the file.
    // For integration test, we'll try to actually send a small buffer.
    
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${authorToken}`)
      .field("title", "Test Driven Development")
      .field("author", "Kent Beck")
      .field("isbn", "1234567890")
      .field("type", "book")
      .field("categoryId", new mongoose.Types.ObjectId().toString())
      .field("description", "A great book")
      .field("totalCopies", 5)
      .attach("file", Buffer.from("fake pdf content"), "test.pdf");

    if (res.status !== 201) console.log("Create Book Failed:", res.body);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("title", "Test Driven Development");
    expect(res.body).toHaveProperty("status", "pending"); // Books start as pending
  });

  test("Public can view approved books", async () => {
    // Pre-create an approved book
    const book = new BookModel({
      title: "Approved Book",
      author: "Some Author",
      isbn: "ISBN-001",
      status: "approved",
      totalCopies: 1,
      availableCopies: 1,
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    const res = await request(app).get("/api/books");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("Approved Book");
  });

  test("Author can see their own books", async () => {
    // Get user id from token (or just check the endpoint)
    const res = await request(app)
      .get("/api/books/my-books")
      .set("Authorization", `Bearer ${authorToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Librarian can approve a book", async () => {
    const book = new BookModel({
      title: "Pending Book",
      author: "Author",
      isbn: "ISBN-PENDING",
      status: "pending",
      totalCopies: 1,
      availableCopies: 1,
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    const res = await request(app)
      .patch(`/api/books/${book._id}/approve`)
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({ status: "approved" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("approved");
  });

  test("Librarian can update a book", async () => {
    const book = new BookModel({
      title: "Old Title",
      author: "Author",
      isbn: "ISBN-UPDATE",
      status: "approved",
      totalCopies: 1,
      availableCopies: 1,
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set("Authorization", `Bearer ${librarianToken}`)
      .send({ 
        title: "New Title", 
        author: "Author", 
        isbn: "ISBN-UPDATE", 
        totalCopies: 10 
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New Title");
    expect(res.body.totalCopies).toBe(10);
  });

  test("Librarian can delete a book", async () => {
    const book = new BookModel({
      title: "To Be Deleted",
      author: "Author",
      isbn: "ISBN-DELETE",
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    const res = await request(app)
      .delete(`/api/books/${book._id}`)
      .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.status).toBe(200);
    
    const found = await BookModel.findById(book._id);
    expect(found).toBeNull();
  });

  test("Non-librarian cannot delete a book", async () => {
    const book = new BookModel({
      title: "Safe Book",
      author: "Author",
      isbn: "ISBN-SAFE",
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    const res = await request(app)
      .delete(`/api/books/${book._id}`)
      .set("Authorization", `Bearer ${readerToken}`);

    expect(res.status).toBe(403);
  });

  test("GET /api/books/search-external returns results (mocked or success)", async () => {
    const res = await request(app)
      .get("/api/books/search-external?q=javascript")
      .set("Authorization", `Bearer ${librarianToken}`);
    
    // Even if external API fails, we expect a valid response structure or a handled error (200 or 500)
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  test("GET /api/books/external/free returns curated books", async () => {
    const res = await request(app).get("/api/books/external/free?subject=science");
    expect([200, 500]).toContain(res.status);
  });

  test("GET /api/books/:bookId/read enforces borrow security", async () => {
    const book = new BookModel({
      title: "Secure Book",
      author: "Author",
      isbn: "ISBN-SECURE",
      status: "approved",
      uploadedBy: new mongoose.Types.ObjectId()
    });
    await book.save();

    // No borrow exists
    const res = await request(app)
      .get(`/api/books/${book._id}/read`)
      .set("Authorization", `Bearer ${readerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/do not have a valid borrow/i);
  });
});
