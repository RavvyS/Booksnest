//  Covers API integration behavior for the materials route.

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");

const materialRoutes = require("../../src/interfaces/routes/materialRoutes");
const authRoutes = require("../../src/interfaces/routes/AuthRoutes");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/materials", materialRoutes);

let mongoServer;
let authorToken;
let librarianToken;

jest.setTimeout(30000);

beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
    mongoServer = await MongoMemoryServer.create({ instance: { ip: "127.0.0.1" } });
    await mongoose.connect(mongoServer.getUri());

    // Register an author
    await request(app).post("/api/auth/register").send({
        name: "Test Author",
        email: "author@test.com",
        password: "Password123!",
        role: "author",
    });
    // Manually approve
    const UserModel = mongoose.model("User");
    await UserModel.findOneAndUpdate({ email: "author@test.com" }, { isApproved: true });
    
    // Login to get token
    const authorLogin = await request(app).post("/api/auth/login").send({
        email: "author@test.com",
        password: "Password123!",
    });
    authorToken = authorLogin.body.token;

    // Register a librarian
    await request(app).post("/api/auth/register").send({
        name: "Test Librarian",
        email: "librarian@test.com",
        password: "Password123!",
        role: "librarian",
    });
    // Manually approve
    await UserModel.findOneAndUpdate({ email: "librarian@test.com" }, { isApproved: true });
    
    const librarianLogin = await request(app).post("/api/auth/login").send({
        email: "librarian@test.com",
        password: "Password123!",
    });
    librarianToken = librarianLogin.body.token;
});

afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
        const LearningMaterialModel = mongoose.model("LearningMaterial");
        await LearningMaterialModel.deleteMany({});
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongoServer) await mongoServer.stop();
});

describe("Materials API — type field refactor", () => {

    test("POST /api/materials with valid type 'video' returns 201 with type in response", async () => {
        const res = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "Intro to Node.js",
                contentUrl: "https://example.com/video/nodejs",
                author: "Jane Doe",
                type: "video",
                category: "Programming",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("type", "video");
        expect(res.body).toHaveProperty("status", "pending");
    });

    test("POST /api/materials with valid type 'audio' returns 201", async () => {
        const res = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "History Audiobook",
                contentUrl: "https://example.com/audio/history",
                author: "John Smith",
                type: "audio",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("type", "audio");
    });

    test("POST /api/materials without type returns 400", async () => {
        const res = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "Missing Type Material",
                contentUrl: "https://example.com/something",
                author: "Jane Doe",
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/type is required/i);
    });

    test("POST /api/materials with invalid type returns 400", async () => {
        const res = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "Wrong Type Material",
                contentUrl: "https://example.com/something",
                author: "Jane Doe",
                type: "ebook",
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/type is required/i);
    });

    test("GET /api/materials/:id returns material with type field", async () => {
        const createRes = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "Video Lecture",
                contentUrl: "https://example.com/video/lecture",
                author: "Prof. Smith",
                type: "video",
            });

        const id = createRes.body.id || createRes.body._id;


        const getRes = await request(app).get(`/api/materials/${id}`);

        expect(getRes.status).toBe(200);
        expect(getRes.body).toHaveProperty("type", "video");
    });

    test("POST /api/materials without auth returns 401", async () => {
        const res = await request(app)
            .post("/api/materials")
            .send({
                title: "No Auth Material",
                contentUrl: "https://example.com/video",
                author: "Jane",
                type: "video",
            });

        expect(res.status).toBe(401);
    });

    test("PATCH /api/materials/:id/approve works correctly for librarian", async () => {
        const createRes = await request(app)
            .post("/api/materials")
            .set("Authorization", `Bearer ${authorToken}`)
            .send({
                title: "Approve Test Video",
                contentUrl: "https://example.com/video/approve",
                author: "Jane Doe",
                type: "video",
            });

        const id = createRes.body.id || createRes.body._id;


        const approveRes = await request(app)
            .patch(`/api/materials/${id}/approve`)
            .set("Authorization", `Bearer ${librarianToken}`)
            .send({ status: "approved" });

        expect(approveRes.status).toBe(200);
        expect(approveRes.body).toHaveProperty("status", "approved");
    });

    test("GET /api/materials/pending returns only pending materials for librarian", async () => {
        const res = await request(app)
            .get("/api/materials/pending")
            .set("Authorization", `Bearer ${librarianToken}`);
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("GET /api/materials/my returns materials uploaded by current author", async () => {
        const res = await request(app)
            .get("/api/materials/my")
            .set("Authorization", `Bearer ${authorToken}`);
        
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
