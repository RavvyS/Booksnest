
//  Implements a single business use case with domain-focused rules.

class GetBooks {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute() {
    return await this.bookRepository.findAllApproved();
  }

  async executePending() {
    return await this.bookRepository.findAllPending();
  }

  async executeByUploader(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return await this.bookRepository.findByUploader(userId);
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
