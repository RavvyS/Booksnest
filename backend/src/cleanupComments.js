
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Comment = require('./infrastructure/database/schemas/CommentSchema');

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/booksnest');
    console.log('Connected successfully.');

    console.log('Fetching all comments...');
    const comments = await Comment.find().populate('userId');
    
    const brokenComments = comments.filter(c => !c.userId);
    console.log(`Found ${brokenComments.length} comments with broken user references.`);

    if (brokenComments.length > 0) {
      const idsToDelete = brokenComments.map(c => c._id);
      const result = await Comment.deleteMany({ _id: { $in: idsToDelete } });
      console.log(`Successfully deleted ${result.deletedCount} "Unknown User" comments.`);
    } else {
      console.log('No "Unknown User" comments found to delete.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
