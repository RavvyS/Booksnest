
//  Implements a single business use case with domain-focused rules.

class DeleteComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute({ commentId, user }) {
    const existingComment = await this.commentRepository.findById(commentId);

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    const existingUserId = existingComment.userId._id ? existingComment.userId._id.toString() : existingComment.userId.toString();
    const isOwner = existingUserId === user.id;
    const isLibrarian = user.role === "librarian";

    if (!isOwner && !isLibrarian) {
      throw new Error("You are not allowed to delete this comment");
    }

    await this.commentRepository.delete(commentId);
  }
}

module.exports = DeleteComment;
