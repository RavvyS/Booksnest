const CommentSchema = require("../schemas/CommentSchema");

class CommentRepositoryImpl {

  async save(comment) {
    const newComment = new CommentSchema(comment);
    const saved = await newComment.save();
    return saved;
  }

  async findAll() {
    return await CommentSchema.find();
  }
}

module.exports = CommentRepositoryImpl;