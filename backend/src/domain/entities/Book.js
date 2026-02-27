class Book {
  constructor({
    id,
    title,
    author,
    isbn,
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
