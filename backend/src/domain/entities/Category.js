
//  Represents a core domain entity used by application logic.

class Category {
  constructor({ id, name, description, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = Category;
