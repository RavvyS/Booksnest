
//  Implements a single business use case with domain-focused rules.

class UpdateBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id, bookData) {
    if (!id) {
      throw new Error("Book ID is required");
    }
    if (!bookData.title || bookData.title.trim() === "") {
      throw new Error("Book title is required");
    }
    if (!bookData.author || bookData.author.trim() === "") {
      throw new Error("Author is required");
    }
    if (!bookData.isbn || bookData.isbn.trim() === "") {
      throw new Error("ISBN is required");
    }

    // Check existence
    const existing = await this.bookRepository.findById(id);
    if (!existing) {
      throw new Error("Book not found");
    }

    // Check ISBN conflict with another book
    if (bookData.isbn !== existing.isbn) {
      const duplicate = await this.bookRepository.findByIsbn(bookData.isbn);
      if (duplicate && duplicate.id !== id) {
        throw new Error("A book with this ISBN already exists");
      }
    }

    return await this.bookRepository.update(id, bookData);
  }
}

module.exports = UpdateBook;
