
//  Represents a core domain entity used by application logic.

class Book {
  constructor({
    id,
    title,
    author,
    isbn,
    type,
    status,
    uploadedBy,
    categoryId,
    description,
    filePath,
    totalCopies,
    availableCopies,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.type = type;
    this.status = status || "pending";
    this.uploadedBy = uploadedBy;
    this.categoryId = categoryId;
    this.description = description;
    this.filePath = filePath || null;
    this.totalCopies = totalCopies;
    this.availableCopies = availableCopies;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = Book;
