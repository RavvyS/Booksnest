
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
const userRoutes = require("./interfaces/routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174"
      ];
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => o && origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => res.json({ status: "ok", message: "Booksnest API is running" }));

app.use("/api/bookmarks", bookMarkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
