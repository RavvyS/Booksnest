class QueueRepository {
  async create(queueData, session) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findByUser(userId) {
    throw new Error("Method not implemented");
  }

  async findActiveRequestByUserAndBook(userId, bookId) {
    throw new Error("Method not implemented");
  }

  async updatePendingByIdAndUser(requestId, userId, updateData) {
    throw new Error("Method not implemented");
  }

  async cancelPendingByIdAndUser(requestId, userId) {
    throw new Error("Method not implemented");
  }

  async claimNextPending(bookId, session) {
    throw new Error("Method not implemented");
  }

  async markFulfilled(requestId, borrowId, session) {
    throw new Error("Method not implemented");
  }

  async markCancelledBySystem(requestId, reason, session) {
    throw new Error("Method not implemented");
  }

  async releaseToPending(requestId, session) {
    throw new Error("Method not implemented");
  }
}

module.exports = QueueRepository;
