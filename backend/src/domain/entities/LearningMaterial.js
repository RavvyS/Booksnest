
//  Represents a core domain entity used by application logic.

class LearningMaterial {
  constructor({ id, title, description, contentUrl, type, category, categoryId, categoryName, author, createdBy, status, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.contentUrl = contentUrl;
    this.type = type;
    this.category = category;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.author = author;
    this.createdBy = createdBy;
    this.status = status || "pending";
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = LearningMaterial;
