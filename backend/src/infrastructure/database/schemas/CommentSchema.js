const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  userId: String,
  materialId: String,
  createdAt: Date,
});

module.exports = mongoose.model("Comment", commentSchema);