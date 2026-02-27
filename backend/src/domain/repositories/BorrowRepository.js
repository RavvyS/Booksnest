class BorrowRepository {
  async create(borrow, session) {
    throw new Error("Method not implemented");
  }

  async findActiveBorrow(userId, bookId) {
    throw new Error("Method not implemented");
  }

  async findValidBorrow(userId, bookId) {
    throw new Error("Method not implemented");
  }

  async markReturned(borrowId, session) {
    throw new Error("Method not implemented");
  }

  async findByUser(userId) {
    throw new Error("Method not implemented");
  }

  async findByBook(bookId) {
    throw new Error("Method not implemented");
  }
}

module.exports = BorrowRepository;
