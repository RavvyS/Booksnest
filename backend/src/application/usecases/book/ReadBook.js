
//  Implements a single business use case with domain-focused rules.

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
  async execute(userId, userRole, bookId) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    // Fetch book to check ownership
    const book = await this.bookRepository.findById(bookId);
    if (!book) throw new Error("Book not found");

    // Access granted if librarian OR uploader OR borrowed
    let accessGranted = false;
    
    if (userRole === "librarian") {
      accessGranted = true;
    } else if (book.uploadedBy === userId) {
      accessGranted = true;
    } else {
      // Check for valid (non-expired, non-returned) borrow
      const validBorrow = await this.borrowRepository.findValidBorrow(
        userId,
        bookId,
      );
      if (validBorrow) {
        accessGranted = true;
      }
    }

    if (!accessGranted) {
      throw new Error(
        "Access denied: you do not have permission to view this book",
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
