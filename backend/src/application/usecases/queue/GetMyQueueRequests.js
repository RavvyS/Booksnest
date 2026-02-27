class GetMyQueueRequests {
  constructor(queueRepository) {
    this.queueRepository = queueRepository;
  }

  async execute(userId) {
    if (!userId) throw new Error("User ID is required");
    return await this.queueRepository.findByUser(userId);
  }
}

module.exports = GetMyQueueRequests;
