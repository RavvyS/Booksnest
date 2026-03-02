
//  Implements a single business use case with domain-focused rules.

class GetBooks {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute() {
    return await this.bookRepository.findAll();
  }

  async executeById(id) {
    if (!id) {
      throw new Error("Book ID is required");
    }

    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  }
}

module.exports = GetBooks;
