class BookRepository {
  async create(book) {
    throw new Error("Method not implemented");
  }

  async findAll() {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findByIsbn(isbn) {
    throw new Error("Method not implemented");
  }

  async update(id, book) {
    throw new Error("Method not implemented");
  }

  async delete(id) {
    throw new Error("Method not implemented");
  }

  async getFilePath(bookId) {
    throw new Error("Method not implemented");
  }

  async atomicDecrementStock(bookId, session) {
    throw new Error("Method not implemented");
  }

  async atomicIncrementStock(bookId, session) {
    throw new Error("Method not implemented");
  }
}

module.exports = BookRepository;
