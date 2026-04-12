
//  Implements a single business use case with domain-focused rules.

class UpdateBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id, bookData, userId, userRole) {
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

    // Authorization check: Librarians can edit anything, authors only their own.
    if (userRole === "author" && existing.uploadedBy !== userId) {
      throw new Error("Access denied: You can only edit your own books");
    }

    // Check ISBN conflict with another book
    if (bookData.isbn !== existing.isbn) {
      const duplicate = await this.bookRepository.findByIsbn(bookData.isbn);
      if (duplicate && duplicate.id !== id) {
        throw new Error("A book with this ISBN already exists");
      }
    }

    // Validation for copies (Merge from Updated upstream)
    if (bookData.totalCopies !== undefined || bookData.availableCopies !== undefined) {
      const tCopies = bookData.totalCopies !== undefined ? Number(bookData.totalCopies) : existing.totalCopies;
      const aCopies = bookData.availableCopies !== undefined ? Number(bookData.availableCopies) : existing.availableCopies;

      if (tCopies < 0 || aCopies < 0) {
        throw new Error("Copies cannot be negative");
      }
      if (aCopies > tCopies) {
        throw new Error("Available copies cannot exceed total copies");
      }
    }

    // Prepare data for update (Merge from Stashed changes)
    // Librarians can update copies and status, authors typically only metadata.
    const updateData = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      categoryId: bookData.categoryId,
      description: bookData.description,
    };

    if (userRole === "librarian") {
      if (bookData.totalCopies !== undefined) updateData.totalCopies = Number(bookData.totalCopies);
      if (bookData.availableCopies !== undefined) updateData.availableCopies = Number(bookData.availableCopies);
      if (bookData.status !== undefined) updateData.status = bookData.status;
    }

    return await this.bookRepository.update(id, updateData);
  }
}

module.exports = UpdateBook;
