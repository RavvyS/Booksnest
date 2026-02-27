
//  Represents a core domain entity used by application logic.

class LearningMaterial {
  constructor({ id, title, description, contentUrl, category, author, status, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.contentUrl = contentUrl;
    this.category = category;
    this.author = author;
    this.status = status || "pending";
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = LearningMaterial;
