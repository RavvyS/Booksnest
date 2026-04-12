
//  Implements a single business use case with domain-focused rules.

class CreateQueueRequest {
  constructor(queueRepository, bookRepository, borrowRepository) {
    this.queueRepository = queueRepository;
    this.bookRepository = bookRepository;
    this.borrowRepository = borrowRepository;
  }

  async execute(userId, bookId, payload) {
    // Ensure payload is a valid object to prevent destructuring/read crashes
    payload = payload || {};
    console.log(`[QueueRequest] Executing for user=${userId}, book=${bookId}`);
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      console.error(`[QueueRequest] Book not found: ${bookId}`);
      throw new Error("Book not found");
    }

    console.log(`[QueueRequest] Book stock: avail=${book.availableCopies}, total=${book.totalCopies}`);

    // If copies are available, instruct the frontend to borrow directly instead
    if (book.availableCopies > 0) {
      console.warn(`[QueueRequest] Rejecting: copies available (${book.availableCopies})`);
      const err = new Error("Copies are available. Please borrow the book directly");
      err.code = "COPIES_AVAILABLE";
      throw err;
    }

    // Check if user already has an active (non-expired) borrow for this book
    const activeBorrow = await this.borrowRepository.findActiveBorrow(userId, bookId);
    if (activeBorrow) {
      console.warn(`[QueueRequest] Rejecting: user already has active borrow ${activeBorrow.id}`);
      const err = new Error("You already have an active borrow for this book");
      err.code = "ALREADY_BORROWED";
      throw err;
    }

    // If user is already in the queue, return their existing position gracefully (no error)
    const existingRequest = await this.queueRepository.findActiveRequestByUserAndBook(userId, bookId);
    if (existingRequest) {
      console.log(`[QueueRequest] User already in queue. Fetching position...`);
      const positionData = await this.queueRepository.getUserPosition(bookId, userId);
      return {
        alreadyQueued: true,
        queueRequestId: existingRequest.id,
        ...(positionData || { position: 1, totalWaiting: 1, status: existingRequest.status }),
      };
    }

    console.log(`[QueueRequest] Creating new request with note: "${payload.note || ''}"`);
    const note = payload.note ? String(payload.note).trim() : "";
    const newRequest = await this.queueRepository.create({ userId, bookId, note });

    // Return with position info as a plain object (class instance can't be spread)
    const positionData = await this.queueRepository.getUserPosition(bookId, userId);
    console.log(`[QueueRequest] Success! RequestId=${newRequest.id}, Position=${positionData?.position ?? 1}`);
    return {
      id: newRequest.id,
      userId: newRequest.userId,
      bookId: newRequest.bookId,
      note: newRequest.note,
      status: newRequest.status,
      createdAt: newRequest.createdAt,
      alreadyQueued: false,
      position: positionData?.position ?? 1,
      totalWaiting: positionData?.totalWaiting ?? 1,
    };
  }
}

module.exports = CreateQueueRequest;
