
class LibrarianCancelQueue {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(requestId) {
    if (!requestId) throw new Error("Queue request ID is required");
    return await this.queueRepository.cancelByLibrarian(requestId);
  }
}

module.exports = LibrarianCancelQueue;
