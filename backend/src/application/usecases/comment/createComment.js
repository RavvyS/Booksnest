const Comment = require("../../../domain/entities/Comment");

class CreateComment {

  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(data) {

    if (!data.content || !data.content.trim()) {
      throw new Error("Content is required");
    }

    if (!data.materialId) {
      throw new Error("materialId is required");
    }

    const comment = new Comment({
      content: data.content.trim(),
      userId: data.userId,
      materialId: data.materialId,
    });

    return await this.commentRepository.save(comment);
  }
}

module.exports = CreateComment;
