
//  Represents a core domain entity used by application logic.

class Comment {
  constructor({ id, content, userId, materialId, createdAt }) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.materialId = materialId;
    this.createdAt = createdAt || new Date();
  }
}

module.exports = Comment;