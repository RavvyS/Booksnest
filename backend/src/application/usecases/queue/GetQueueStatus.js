
class GetQueueStatus {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(userId, bookId) {
    if (!userId) throw new Error("User ID is required");
    if (!bookId) throw new Error("Book ID is required");

    return await this.queueRepository.getUserPosition(bookId, userId);
  }
}

module.exports = GetQueueStatus;
