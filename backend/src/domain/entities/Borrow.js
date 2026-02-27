class Borrow {
  constructor({
    id,
    userId,
    bookId,
    borrowedAt,
    dueDate,
    returnedAt,
    returned,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.borrowedAt = borrowedAt;
    this.dueDate = dueDate;
    this.returnedAt = returnedAt || null;
    this.returned = returned || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = Borrow;
