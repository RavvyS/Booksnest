
//  Implements a single business use case with domain-focused rules.

const Comment = require("../../../domain/entities/Comment");

class CreateComment {

  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(data) {

    if (!data.content || !data.content.trim()) {
      throw new Error("Content is required");
    }

    if (!data.materialId && !data.bookId) {
      throw new Error("materialId or bookId is required");
    }

    const commentData = {
      content: data.content.trim(),
      userId: data.userId,
    };

    if (data.materialId) commentData.materialId = data.materialId;
    if (data.bookId) commentData.bookId = data.bookId;

    const comment = new Comment(commentData);

    return await this.commentRepository.save(comment);
  }
}

module.exports = CreateComment;
