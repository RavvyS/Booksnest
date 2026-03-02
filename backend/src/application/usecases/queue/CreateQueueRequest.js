
//  Implements a single business use case with domain-focused rules.

class CreateQueueRequest {
  constructor(queueRepository, bookRepository, borrowRepository) {
    this.queueRepository = queueRepository;
    this.bookRepository = bookRepository;
    this.borrowRepository = borrowRepository;
  }

  async execute(userId, bookId, payload = {}) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (book.availableCopies > 0) {
      throw new Error("Copies are available. Please borrow the book directly");
    }

    const activeBorrow = await this.borrowRepository.findActiveBorrow(
      userId,
      bookId,
    );
    if (activeBorrow) {
      throw new Error("You already have an active borrow for this book");
    }

    const existingRequest =
      await this.queueRepository.findActiveRequestByUserAndBook(userId, bookId);
    if (existingRequest) {
      throw new Error("You already have an active queue request for this book");
    }

    const note = payload.note ? String(payload.note).trim() : "";

    return await this.queueRepository.create({
      userId,
      bookId,
      note,
    });
  }
}

module.exports = CreateQueueRequest;
