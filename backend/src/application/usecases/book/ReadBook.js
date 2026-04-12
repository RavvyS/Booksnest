
//  Implements a single business use case with domain-focused rules.

class ReadBook {
  constructor(borrowRepository, bookRepository) {
    this.borrowRepository = borrowRepository;
    this.bookRepository = bookRepository;
  }

  /**
   * Validates borrow permission and returns the file path for streaming.
   *
   * Access is granted if:
   * - User is the author (uploadedBy match)
   * - OR User has an active borrow (returned = false)
   * - AND dueDate > current time (not expired)
   */
  async execute(userId, bookId, userRole) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    // Check if user is the author or librarian
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    const isAuthor = book.uploadedBy === userId || book.uploadedBy?.toString() === userId;
    const isLibrarian = userRole === "librarian";

    let validBorrow = null;
    if (!isAuthor && !isLibrarian) {
      // Check for valid (non-expired, non-returned) borrow
      validBorrow = await this.borrowRepository.findValidBorrow(
        userId,
        bookId,
      );
      if (!validBorrow) {
        throw new Error(
          "Access denied: you do not have a valid borrow for this book",
        );
      }
    }

    // Get the file path
    const filePath = await this.bookRepository.getFilePath(bookId);
    if (!filePath) {
      throw new Error("No file available for this book");
    }

    return { filePath, borrow: validBorrow };
  }
}

module.exports = ReadBook;
