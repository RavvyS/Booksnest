const Comment = require("../../../domain/entities/Comment");

class CreateComment {

  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(data) {

    if (!data.content) {
      throw new Error("Content is required");
    }

    const comment = new Comment({
      content: data.content,
      userId: data.userId,
      materialId: data.materialId,
    });

    return await this.commentRepository.save(comment);
  }
}

module.exports = CreateComment;