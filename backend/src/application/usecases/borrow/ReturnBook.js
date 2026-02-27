const mongoose = require("mongoose");

class ReturnBook {
  constructor(borrowRepository, bookRepository) {
    this.borrowRepository = borrowRepository;
    this.bookRepository = bookRepository;
  }

  /**
   * Return a book with full transaction safety.
   *
   * Flow:
   * 1. Start session + transaction
   * 2. Find active borrow (userId + bookId + returned=false)
   * 3. Mark borrow as returned (within transaction)
   * 4. Atomic increment availableCopies (within transaction)
   * 5. Commit — or abort on any failure
   */
  async execute(userId, bookId) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Find the active borrow
      const activeBorrow = await this.borrowRepository.findActiveBorrow(
        userId,
        bookId,
      );
      if (!activeBorrow) {
        throw new Error("No active borrow found for this book");
      }

      // Step 2: Mark borrow as returned within the transaction
      const updatedBorrow = await this.borrowRepository.markReturned(
        activeBorrow.id,
        session,
      );
      if (!updatedBorrow) {
        throw new Error("Failed to update borrow record");
      }

      // Step 3: Atomic stock increment within the transaction
      const updatedBook = await this.bookRepository.atomicIncrementStock(
        bookId,
        session,
      );
      if (!updatedBook) {
        throw new Error("Failed to increment book stock");
      }

      // Step 4: Commit transaction
      await session.commitTransaction();

      return {
        message: "Book returned successfully",
        borrow: updatedBorrow,
      };
    } catch (error) {
      // Abort transaction — rolls back both changes
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = ReturnBook;
