class ReadBook {
  constructor(borrowRepository, bookRepository) {
    this.borrowRepository = borrowRepository;
    this.bookRepository = bookRepository;
  }

  /**
   * Validates borrow permission and returns the file path for streaming.
   *
   * Access is granted only if:
   * - User has an active borrow (returned = false)
   * - dueDate > current time (not expired)
   */
  async execute(userId, bookId) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    // Check for valid (non-expired, non-returned) borrow
    const validBorrow = await this.borrowRepository.findValidBorrow(
      userId,
      bookId,
    );
    if (!validBorrow) {
      throw new Error(
        "Access denied: you do not have a valid borrow for this book",
      );
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
