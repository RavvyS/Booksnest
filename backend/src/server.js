const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


const bookMarkRoutes = require("./interfaces/routes/bookmarkRoutes");
const authRoutes = require("./interfaces/routes/AuthRoutes");
const commentRoutes = require("./interfaces/routes/commentRoutes");
const materialRoutes = require("./interfaces/routes/materialRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());


app.use("/api/bookmarks", bookMarkRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/materials", materialRoutes);

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDB connection success!");
    app.listen(PORT, () => {
      console.log(`Server is up and running on port number: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
