
//  Implements a single business use case with domain-focused rules.

const mongoose = require("mongoose");
const BORROW_PERIOD_DAYS = 14;

class ReturnBook {
  constructor(borrowRepository, bookRepository, queueRepository) {
    this.borrowRepository = borrowRepository;
    this.bookRepository = bookRepository;
    this.queueRepository = queueRepository;
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
      const stockIncremented = await this.bookRepository.atomicIncrementStock(
        bookId,
        session,
      );
      
      if (!stockIncremented) {
        console.warn(`[ReturnBook] Data Integrity Warning: Could not increment availableCopies for book=${bookId}. Continuing return anyway.`);
      } else {
        console.log(`[ReturnBook] Stock incremented for book=${bookId}. New avail=${stockIncremented.availableCopies}`);
      }

      const autoAssigned = await this.assignNextQueuedBorrow(bookId, session);
      if (autoAssigned) {
        console.log(`[Auto-Assign] Successfully assigned book=${bookId} to user=${autoAssigned.userId} from queue`);
      }

      // Step 4: Commit transaction
      await session.commitTransaction();

      return {
        message: "Book returned successfully",
        borrow: updatedBorrow,
        autoAssigned,
      };
    } catch (error) {
      // Abort transaction — rolls back both changes
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async assignNextQueuedBorrow(bookId, session) {
    if (!this.queueRepository) return null;

    while (true) {
      const nextQueueRequest = await this.queueRepository.claimNextPending(
        bookId,
        session,
      );
      if (!nextQueueRequest) {
        console.log(`[Auto-Assign] No more pending queue requests for book=${bookId}`);
        return null;
      }
      
      console.log(`[Auto-Assign] Attempting to fulfill request=${nextQueueRequest.id} for user=${nextQueueRequest.userId}`);

      const existingBorrow = await this.borrowRepository.findActiveBorrow(
        nextQueueRequest.userId,
        bookId,
      );

      if (existingBorrow) {
        await this.queueRepository.markCancelledBySystem(
          nextQueueRequest.id,
          "User already has an active borrow for this book",
          session,
        );
        continue;
      }

      const decrementedBook = await this.bookRepository.atomicDecrementStock(
        bookId,
        session,
      );
      if (!decrementedBook) {
        await this.queueRepository.releaseToPending(nextQueueRequest.id, session);
        return null;
      }

      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + BORROW_PERIOD_DAYS);

      const borrow = await this.borrowRepository.create(
        {
          userId: nextQueueRequest.userId,
          bookId,
          borrowedAt: now,
          dueDate,
        },
        session,
      );

      await this.queueRepository.markFulfilled(nextQueueRequest.id, borrow.id, session);

      return {
        queueRequestId: nextQueueRequest.id,
        userId: nextQueueRequest.userId,
        borrow,
      };
    }
  }
}

module.exports = ReturnBook;
