
//  Builds and configures the Express application with all API routes.

const express = require("express");
const cors = require("cors");

const bookMarkRoutes = require("./interfaces/routes/bookmarkRoutes");
const authRoutes = require("./interfaces/routes/AuthRoutes");
const commentRoutes = require("./interfaces/routes/commentRoutes");
const categoryRoutes = require("./interfaces/routes/categoryRoutes");
const bookRoutes = require("./interfaces/routes/bookRoutes");
const borrowRoutes = require("./interfaces/routes/borrowRoutes");
const materialRoutes = require("./interfaces/routes/materialRoutes");
const queueRoutes = require("./interfaces/routes/queueRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/bookmarks", bookMarkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/queues", queueRoutes);

module.exports = app;
