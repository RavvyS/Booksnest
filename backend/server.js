const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");




dotenv.config(); // Load environment variables once

const PORT = process.env.PORT || 8070;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

// MongoDB connection
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection success!");
});


app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
