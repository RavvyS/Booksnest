const CommentSchema = require("../database/schemas/CommentSchema");

class CommentRepositoryImpl {

  async save(comment) {
    const newComment = new CommentSchema(comment);
    const saved = await newComment.save();
    return saved;
  }

  async findAll() {
    return await CommentSchema.find().sort({ createdAt: -1 });
  }

  async findByMaterialId(materialId) {
    return await CommentSchema.find({ materialId }).sort({ createdAt: -1 });
  }

  async findById(commentId) {
    return await CommentSchema.findById(commentId);
  }

  async update(commentId, data) {
    return await CommentSchema.findByIdAndUpdate(
      commentId,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async delete(commentId) {
    return await CommentSchema.findByIdAndDelete(commentId);
  }
}

module.exports = CommentRepositoryImpl;
