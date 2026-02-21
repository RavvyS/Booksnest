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