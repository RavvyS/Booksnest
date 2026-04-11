const mongoose = require('mongoose');
const Comment = require('./infrastructure/database/schemas/CommentSchema');
require('dotenv').config({ path: '../.env' }); // Make sure correct path is used or just let dotenv find it

async function clearComments() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB.");

    const result = await Comment.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} comments.`);

  } catch (error) {
    console.error("Error clearing comments:", error);
  } finally {
    process.exit(0);
  }
}

clearComments();
