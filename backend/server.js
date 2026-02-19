const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const learningMaterials = require('./routes/learningMaterials');

const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const URL = process.env.MONGODB_URL || process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(URL)
    .then(() => console.log('MongoDB connection success!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/materials", learningMaterials);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
