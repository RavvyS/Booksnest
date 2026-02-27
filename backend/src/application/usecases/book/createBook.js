const Book = require("../../../domain/entities/Book");

class CreateBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(bookData) {
    if (!bookData.title || bookData.title.trim() === "") {
      throw new Error("Book title is required");
    }
    if (!bookData.author || bookData.author.trim() === "") {
      throw new Error("Author is required");
    }
    if (!bookData.isbn || bookData.isbn.trim() === "") {
      throw new Error("ISBN is required");
    }
    if (
      bookData.totalCopies === undefined ||
      bookData.totalCopies === null ||
      bookData.totalCopies < 1
    ) {
      throw new Error("Total copies must be at least 1");
    }

    // Check for duplicate ISBN
    const existing = await this.bookRepository.findByIsbn(bookData.isbn);
    if (existing) {
      throw new Error("A book with this ISBN already exists");
    }

    const book = new Book({
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      categoryId: bookData.categoryId || null,
      description: bookData.description || "",
      filePath: bookData.filePath || null,
      totalCopies: bookData.totalCopies,
      availableCopies: bookData.totalCopies,
    });

    return await this.bookRepository.create(book);
  }
}

module.exports = CreateBook;
