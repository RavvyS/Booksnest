
//  Represents a core domain entity used by application logic.

class QueueRequest {
  constructor({
    id,
    userId,
    bookId,
    note,
    status,
    fulfilledBorrowId,
    cancellationReason,
    cancelledAt,
    fulfilledAt,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.note = note || "";
    this.status = status || "pending";
    this.fulfilledBorrowId = fulfilledBorrowId || null;
    this.cancellationReason = cancellationReason || null;
    this.cancelledAt = cancelledAt || null;
    this.fulfilledAt = fulfilledAt || null;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

module.exports = QueueRequest;
