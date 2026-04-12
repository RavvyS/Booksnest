
class GetBookQueue {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(bookId) {
    if (!bookId) throw new Error("Book ID is required");
    return await this.queueRepository.findActiveByBook(bookId);
  }
}

module.exports = GetBookQueue;
