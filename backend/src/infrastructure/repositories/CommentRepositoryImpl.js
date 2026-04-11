//  Implements persistence operations against MongoDB models.

const CommentSchema = require("../database/schemas/CommentSchema");

class CommentRepositoryImpl {

  async save(comment) {
    const newComment = new CommentSchema(comment);
    const saved = await newComment.save();
    return await CommentSchema.findById(saved._id).populate("userId", "name");
  }

  async findAll() {
    return await CommentSchema.find().populate("userId", "name").sort({ createdAt: -1 });
  }

  async findByMaterialId(materialId) {
    return await CommentSchema.find({ materialId }).populate("userId", "name").sort({ createdAt: -1 });
  }

  async findByBookId(bookId) {
    return await CommentSchema.find({ bookId }).populate("userId", "name").sort({ createdAt: -1 });
  }

  async findById(commentId) {
    return await CommentSchema.findById(commentId).populate("userId", "name");
  }

  async update(commentId, data) {
    return await CommentSchema.findByIdAndUpdate(
      commentId,
      { $set: data },
      { new: true, runValidators: true }
    ).populate("userId", "name");
  }

  async delete(commentId) {
    return await CommentSchema.findByIdAndDelete(commentId);
  }
}

module.exports = CommentRepositoryImpl;
