const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const express = require("express");

const authRoutes = require("../../src/interfaces/routes/AuthRoutes");
const borrowRoutes = require("../../src/interfaces/routes/borrowRoutes");
const bookRoutes = require("../../src/interfaces/routes/bookRoutes");
const UserModel = require("../../src/infrastructure/database/UserModel");
const BookModel = require("../../src/infrastructure/database/schemas/BookSchema");
const BorrowModel = require("../../src/infrastructure/database/schemas/BorrowSchema");
const QueueModel = require("../../src/infrastructure/database/schemas/QueueRequestSchema");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);

let mongoServer;
jest.setTimeout(30000);

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random()}@example.com`;

const TokenService = require("../../src/infrastructure/services/TokenService");

const registerAndGetToken = async ({ name, email, role }) => {
  const user = new UserModel({
    name,
    email,
    password: "StrongPass123!",
    role,
    isApproved: true
  });
  await user.save();
  return TokenService.generate(user);
};

const createBook = async (overrides = {}) => {
  const defaultData = {
    title: "Test Book",
    author: "Author",
    isbn: `ISBN-${Date.now()}-${Math.random()}`,
    type: "book",
    uploadedBy: new mongoose.Types.ObjectId(),
    totalCopies: 1,
    availableCopies: 1,
  };
  const book = new BookModel({ ...defaultData, ...overrides });
  return await book.save();
};

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 }
  });
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Promise.all([
      UserModel.deleteMany({}),
      BookModel.deleteMany({}),
      BorrowModel.deleteMany({}),
      QueueModel.deleteMany({}),
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

describe("Borrow API integration", () => {
  test("POST /api/borrows/borrow/:bookId requires authentication", async () => {
    const book = await createBook();

    const res = await request(app).post(`/api/borrows/borrow/${book.id}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("reader can borrow and return a book and see history", async () => {
    const token = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const book = await createBook({ totalCopies: 2, availableCopies: 2 });

    const borrowRes = await request(app)
      .post(`/api/borrows/borrow/${book.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(borrowRes.status).toBe(201);
    expect(borrowRes.body.bookId || borrowRes.body.book?.id).toBeDefined();

    const historyRes = await request(app)
      .get("/api/borrows/my-borrows")
      .set("Authorization", `Bearer ${token}`);

    expect(historyRes.status).toBe(200);
    expect(Array.isArray(historyRes.body)).toBe(true);
    expect(historyRes.body.length).toBe(1);

    const returnRes = await request(app)
      .post(`/api/borrows/return/${book.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(returnRes.status).toBe(200);
    expect(returnRes.body.message).toBe("Book returned successfully");
  });

  test("borrowing fails when no copies are available", async () => {
    const token = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const book = await createBook({ totalCopies: 0, availableCopies: 0 });

    const res = await request(app)
      .post(`/api/borrows/borrow/${book.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("No copies available for this book");
  });
});

describe("Queue API integration (borrow system)", () => {
  test("reader can create a queue request when book has no copies", async () => {
    const token = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const book = await createBook({ totalCopies: 0, availableCopies: 0 });

    const res = await request(app)
      .post(`/api/borrows/queue/${book.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ note: "Please notify me" });

    expect(res.status).toBe(201);
    expect(res.body.bookId || res.body.book?.id).toBeDefined();
  });

  test("reader can see and update their queue requests", async () => {
    const token = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader"),
      role: "reader",
    });
    const book = await createBook({ totalCopies: 0, availableCopies: 0 });

    const createRes = await request(app)
      .post(`/api/borrows/queue/${book.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ note: "Initial note" });

    expect(createRes.status).toBe(201);
    const queueId = createRes.body.id || createRes.body._id;

    const listRes = await request(app)
      .get("/api/borrows/queue/my")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);

    const updateRes = await request(app)
      .put(`/api/borrows/queue/${queueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ note: "Updated note" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.note).toBe("Updated note");
  });

  test("reader can delete their queue request", async () => {
    const token = await registerAndGetToken({
      name: "Reader",
      email: uniqueEmail("reader-delete"),
      role: "reader",
    });
    const book = await createBook({ totalCopies: 0, availableCopies: 0 });

    const createRes = await request(app)
      .post(`/api/borrows/queue/${book.id}`)
      .set("Authorization", `Bearer ${token}`);

    const queueId = createRes.body.id || createRes.body._id;

    const deleteRes = await request(app)
      .delete(`/api/borrows/queue/${queueId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Queue request cancelled");
  });

  test("auto-assignment: returning a book fulfills the next queue request", async () => {
    // 1. User A borrows the only copy
    const tokenA = await registerAndGetToken({ name: "User A", email: uniqueEmail("userA"), role: "reader" });
    const book = await createBook({ totalCopies: 1, availableCopies: 1 });
    
    await request(app).post(`/api/borrows/borrow/${book.id}`).set("Authorization", `Bearer ${tokenA}`);

    // 2. User B joins the queue
    const tokenB = await registerAndGetToken({ name: "User B", email: uniqueEmail("userB"), role: "reader" });
    await request(app).post(`/api/borrows/queue/${book.id}`).set("Authorization", `Bearer ${tokenB}`);

    // 3. User A returns the book
    const returnRes = await request(app)
      .post(`/api/borrows/return/${book.id}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(returnRes.status).toBe(200);
    expect(returnRes.body.autoAssigned).toBeDefined();
    
    // 4. Verify User B now has the book
    const historyResB = await request(app)
      .get("/api/borrows/my-borrows")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(historyResB.body.length).toBe(1);
    expect(historyResB.body[0].returned).toBe(false);
  });
});

