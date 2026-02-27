
//  Implements a single business use case with domain-focused rules.

const mongoose = require("mongoose");
const Borrow = require("../../../domain/entities/Borrow");

const BORROW_PERIOD_DAYS = 14;

class BorrowBook {
  constructor(borrowRepository, bookRepository) {
    this.borrowRepository = borrowRepository;
    this.bookRepository = bookRepository;
  }

  /**
   * Borrow a book with full transaction safety.
   *
   * Flow:
   * 1. Start session + transaction
   * 2. Check for active borrow (prevent duplicates)
   * 3. Atomic decrement availableCopies (race-safe)
   * 4. Create borrow record (within transaction)
   * 5. Commit — or abort on any failure
   */
  async execute(userId, bookId) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Check for duplicate active borrow
      const activeBorrow = await this.borrowRepository.findActiveBorrow(
        userId,
        bookId,
      );
      if (activeBorrow) {
        throw new Error("You already have an active borrow for this book");
      }

      // Step 2: Atomic stock decrement (race-condition safe)
      // Only succeeds if availableCopies > 0
      const updatedBook = await this.bookRepository.atomicDecrementStock(
        bookId,
        session,
      );
      if (!updatedBook) {
        throw new Error("No copies available for this book");
      }

      // Step 3: Create borrow record within the same transaction
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + BORROW_PERIOD_DAYS);

      const borrowData = {
        userId,
        bookId,
        borrowedAt: now,
        dueDate,
      };

      const borrow = await this.borrowRepository.create(borrowData, session);

      // Step 4: Commit transaction
      await session.commitTransaction();

      return borrow;
    } catch (error) {
      // Abort transaction — rolls back stock decrement and borrow creation
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = BorrowBook;
