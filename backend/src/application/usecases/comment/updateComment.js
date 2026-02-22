class UpdateComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute({ commentId, content, user }) {
    if (!content || !content.trim()) {
      throw new Error("Content is required");
    }

    const existingComment = await this.commentRepository.findById(commentId);

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    const isOwner = existingComment.userId.toString() === user.id;
    const isLibrarian = user.role === "librarian";

    if (!isOwner && !isLibrarian) {
      throw new Error("You are not allowed to update this comment");
    }

    return await this.commentRepository.update(commentId, {
      content: content.trim(),
    });
  }
}

module.exports = UpdateComment;
